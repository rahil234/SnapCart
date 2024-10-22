import { Request, Response } from 'express';
import productModel from '@/models/productModel';

const addProduct = async (req: Request, res: Response) => {
  try {
    const { productName, description, category, subcategory } = req.body;
    const variants = JSON.parse(req.body.variants);

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

    // Iterate over variants and save each as a new product
    const savedProducts = [];
    for (const [index, variant] of variants.entries()) {
      const newProduct = new productModel({
        name: productName,
        description,
        category,
        subcategory,
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

export default { addProduct, editProduct };
