import { Request, Response } from 'express';
import productModel from '@/models/productModel';

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

    console.log(variantImagesMap);

    // Iterate over variants and save each as a new product
    const savedProducts = [];

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
      });
      await newProduct.save();
      savedProducts.push(newProduct);
    }

    res.status(201).json({
      message: 'Products added successfully',
      products: savedProducts,
    });
  } catch {
    // console.log(error);
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
    const { subcategoryId } = req.params;
    console.log(subcategoryId);
    const products = await productModel
      .find({ subcategory: subcategoryId })
      .limit(5);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching related products' });
  }
};
interface custominterface {
  message: string;
}
const getProducts = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const products = await productModel
      .find()
      .populate('category')
      .populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    const newError = error as custominterface;
    console.log(error);
    res.status(400).json({ message: newError.message });
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
  unlistProduct,
  listProduct,
};
