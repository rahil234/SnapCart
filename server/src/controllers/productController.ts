import { Request, Response } from 'express';
import moogose from 'mongoose';
import productModel from '@/models/productModel';
import { catchError, Product } from '@shared/types';
import categoryModel from '@models/categoryModel';
import variantModel from '@models/variantModel';
import subcategoryModel from '@models/subcategoryModel';
import mongoose from 'mongoose';

const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const product = await productModel
      .findById(productId)
      .populate(['category', 'subcategory']);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const x = product.toObject() as Product;

    const variants = await productModel.find({
      variantId: product.variantId,
    });

    if (variants.filter((variant) => variant._id.toString() !== productId)) {
      x.variants = variants.map((variant) => ({
        id: variant._id,
        variantName: variant.variantName,
        price: variant.price,
      })) as any; //eslint-disable-line
    }

    res.status(200).json(x);
  } catch (error) {
    console.log('Error fetching product', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTopProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel
      .find({ status: 'Active' })
      .sort({ soldCount: -1 })
      .limit(10);

    res.status(200).json(products);
  } catch (error) {
    console.log('Error fetching top products', error);

    res.status(500).json({ message: 'Internal server error' });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const { productName, description, category, subcategory, variants } =
      req.body;

    //chack the category and subcategory is valid
    const categoryExist = await categoryModel.findById(category);
    const subcategoryExist = await subcategoryModel.findById(subcategory);

    console.log(categoryExist, subcategoryExist);

    if (!categoryExist || !subcategoryExist) {
      res.status(400).json({ message: 'Category or SubCategory is not valid' });
      return;
    }

    console.log(req.files);

    const images = req.files as Express.Multer.File[];

    const variantImagesMap: { [key: string]: string[] } = {};

    images.forEach((image) => {
      const match = image.fieldname.match(
        /variants\[(\d+)\]\[images\]\[(\d+)\]/
      );
      if (match) {
        const variantIndex = match[1];
        if (!variantImagesMap[variantIndex]) {
          variantImagesMap[variantIndex] = [];
        }
        variantImagesMap[variantIndex].push(image.filename.split('/')[1]);
      }
    });

    const savedProducts = [];

    const variantId = (await variantModel.create({ name: productName }))._id;

    for (const [index, variant] of variants.entries()) {
      const newProduct = new productModel({
        variantId,
        name: productName,
        description,
        category,
        subcategory,
        quantity: variant.name,
        price: variant.price,
        stock: variant.stock,
        images: variantImagesMap[index] || [],
        variantName: variant.name,
        seller: req.user?._id,
      });
      await newProduct.save();
      savedProducts.push(newProduct);
    }

    res.status(201).json({
      message: 'Products added successfully',
      products: savedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding products' });
  }
};

const editProduct = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      productName,
      category,
      subcategory,
      price,
      quantity,
      stock,
      variantName,
    } = req.body;

    const images = req.files as Express.Multer.File[];

    const imagePaths = images.map((image) => image.filename.split('/')[1]);

    const newProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        name: productName,
        category,
        subcategory,
        price,
        quantity,
        stock,
        variantName,
        images: imagePaths,
      },
      { new: true }
    );

    res.status(200).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding product' });
  }
};

const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const currentProduct = await productModel
      .findById(productId)
      .populate('category');
    if (!currentProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const relatedProducts = await productModel
      .find({
        subcategory: currentProduct.subcategory
          ? currentProduct.subcategory._id
          : null,
        _id: { $ne: productId },
      })
      .limit(7);

    const products = relatedProducts;
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching related products' });
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await productModel
      .find({ category, status: 'Active' })
      .populate('category')
      .populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    const myError = error as catchError;
    res.status(400).json({ message: myError.message });
  }
};

const getProductsByUser = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find();

    const categoryProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await productModel
          .find({ category: category._id, status: 'Active', stock: { $gt: 0 } })
          .limit(10);

        return {
          categoryId: category._id,
          category: category.name,
          products,
        };
      })
    );

    res.json(categoryProducts);
  } catch (err) {
    console.error('Error:', err);
    res.status(404).json({ message: err });
  }
};

const getProductsByAdmin = async (req: Request, res: Response) => {
  try {
    const productsByVariant = await productModel.aggregate([
      {
        $lookup: {
          from: 'variants',
          localField: 'variantId',
          foreignField: '_id',
          as: 'variantInfo',
        },
      },
      {
        $lookup: {
          from: 'categories',
          let: { category: { $toObjectId: '$category' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$category'] } } },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          let: { subcategory: { $toObjectId: '$subcategory' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$subcategory'] } } },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: 'subcategory',
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category', 0] },
          subcategory: { $arrayElemAt: ['$subcategory', 0] },
        },
      },
      {
        $group: {
          _id: '$variantId',
          products: { $push: '$$ROOT' },
          category: { $first: '$category' },
          subcategory: { $first: '$subcategory' },
        },
      },
    ]);

    console.log('p', productsByVariant[0].products);

    res.status(200).json(productsByVariant);
  } catch (error) {
    const myError = error as catchError;
    res.status(400).json({ message: myError.message });
  }
};

const getProductsBySeller = async (req: Request, res: Response) => {
  try {
    const productsByVariant = await productModel.aggregate([
      { $match: { seller: new moogose.Types.ObjectId(req.user?._id) } },
      {
        $lookup: {
          from: 'variants',
          localField: 'variantId',
          foreignField: '_id',
          as: 'variantInfo',
        },
      },
      {
        $lookup: {
          from: 'categories',
          let: { category: { $toObjectId: '$category' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$category'] } } },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          let: { subcategory: { $toObjectId: '$subcategory' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$subcategory'] } } },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: 'subcategory',
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category', 0] },
          subcategory: { $arrayElemAt: ['$subcategory', 0] },
        },
      },
      {
        $group: {
          _id: '$variantId',
          products: { $push: '$$ROOT' },
          category: { $first: '$category' },
          subcategory: { $first: '$subcategory' },
        },
      },
    ]);

    res.status(200).json(productsByVariant);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as catchError).message });
  }
};

const unListProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    await productModel.findByIdAndUpdate(productId, { status: 'Inactive' });
    res.status(200).json({ message: 'Product unlisted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error unlisting product' });
  }
};

const listProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    await productModel.findByIdAndUpdate(productId, { status: 'Active' });
    res.status(200).json({ message: 'Product listed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error listing product' });
  }
};

const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query, category, minPrice, maxPrice, sortBy } = req.query as {
      query: string;
      category: string;
      minPrice: string;
      maxPrice: string;
      sortBy: string;
    };

    //eslint-disable-next-line
    const searchCriteria: any = {
      name: { $regex: new RegExp(query, 'i') },
      status: 'Active',
    };

    if (category) {
      searchCriteria.category = category;
    }

    if (minPrice) {
      searchCriteria.price = { $gte: Number(minPrice) };
    }

    if (maxPrice) {
      if (!searchCriteria.price) {
        searchCriteria.price = {};
      }
      searchCriteria.price.$lte = Number(maxPrice);
    }

    //eslint-disable-next-line
    const sortOptions: any = {};
    if (sortBy) {
      const [field, order] = sortBy.split('.');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    const findedProducts = await productModel
      .find(searchCriteria)
      .sort(sortOptions);

    const products = findedProducts;

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error searching products' });
  }
};

export default {
  getProduct,
  addProduct,
  editProduct,
  getRelatedProducts,
  getProductByCategory,
  getProductsByUser,
  getProductsByAdmin,
  getProductsBySeller,
  unListProduct,
  listProduct,
  searchProducts,
  getTopProducts,
};
