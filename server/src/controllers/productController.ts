import { Request, Response } from 'express';
import productModel from '@/models/productModel';
import { catchError } from '@shared/types';
import { log } from 'console';
import categoryModel from '@models/categoryModel';

const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const product = await productModel
      .findOne({ _id: productId })
      .populate('category')
      .populate('subcategory');

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { productName, description, category, subcategory } = req.body;
    const variants = req.body.variants;

    const images = req.files as Express.Multer.File[];

    // Create a map to store images for each variant
    const variantImagesMap: { [key: string]: string[] } = {};

    // Populate the map with images
    images.forEach((image) => {
      const match = image.fieldname.match(
        /variants\[(\d+)\]\[images\]\[(\d+)\]/
      );
      if (match) {
        const variantIndex = match[1];
        if (!variantImagesMap[variantIndex]) {
          variantImagesMap[variantIndex] = [];
        }
        variantImagesMap[variantIndex].push(image.filename);
      }
    });

    // console.log(variantImagesMap);

    // Iterate over variants and save each as a new product
    const savedProducts = [];

    log('variants', variants);

    for (const [index, variant] of variants.entries()) {
      const newProduct = new productModel({
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
  console.log(req.body);

  try {
    const {
      productId,
      productName,
      category,
      subcategory,
      price,
      quantity,
      stock,
    } = req.body;

    const images = req.files as Express.Multer.File[];

    // Save images to the uploads folder
    const imagePaths = images.map((image) => image.filename);

    const newProduct = await productModel.findByIdAndUpdate(productId, {
      name: productName,
      category,
      subcategory,
      price,
      quantity,
      stock,
      images: imagePaths,
    });

    res
      .status(200)
      .json({ message: 'Product edited successfully', product: newProduct });
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
    console.log(category);
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
    const categories = await categoryModel.find().limit(5);

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
    const products = await productModel
      .find()
      .populate('category')
      .populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    const myError = error as catchError;
    res.status(400).json({ message: myError.message });
  }
};

const getProductsBySeller = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const products = await productModel
      .find({ seller: req.user?._id })
      .populate('category')
      .populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    const myError = error as catchError;
    console.log(myError);
    res.status(400).json({ message: myError.message });
  }
};

const unlistProduct = async (req: Request, res: Response) => {
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

export default {
  getProduct,
  addProduct,
  editProduct,
  getRelatedProducts,
  getProductByCategory,
  getProductsByUser,
  getProductsByAdmin,
  getProductsBySeller,
  unlistProduct,
  listProduct,
};
