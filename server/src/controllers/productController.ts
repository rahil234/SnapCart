import { Request, Response } from 'express';
import productModel from '@/models/productModel';
import { catchError } from '@shared/types';
import { log } from 'console';

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
      .limit(5);

    const products = relatedProducts;
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching related products' });
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
    const products = await productModel
      .find({ seller: req.user?._id })
      .populate('category')
      .populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    const myError = error as catchError;
    res.status(400).json({ message: myError.message });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel
      .find()
      .populate('category')
      .populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    const myError = error as catchError;
    console.log(error);
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
  addProduct,
  editProduct,
  getRelatedProducts,
  getProducts,
  getProductsByAdmin,
  getProductsBySeller,
  unlistProduct,
  listProduct,
};
