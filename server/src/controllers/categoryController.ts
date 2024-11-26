import { Request, Response } from 'express';
import categoryModel from '../models/categoryModel';
import subcategoryModel from '../models/subcategoryModel';
import { catchError } from 'shared/types';

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find();
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await subcategoryModel.find({
          category: category._id,
        });
        return { ...category.toObject(), subcategories };
      })
    );
    res.status(200).json(categoriesWithSubcategories);
  } catch (err) {
    const myError = err as catchError;
    res.status(500).json({ message: myError.message });
  }
};

const addCategory = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    const { categoryName, subcategoryName, categoryId } = req.body;

    if (categoryId) {
      const newSubCategory = new subcategoryModel({
        name: subcategoryName,
        category: categoryId,
      });
      newSubCategory.save();
      res.status(200).json({ message: 'Subcategories added successfully' });
    } else {
      // Create new category with subcategories
      const newCategory = new categoryModel({ name: categoryName });
      await newCategory.save();

      const newSubCategory = new subcategoryModel({
        name: subcategoryName,
        category: newCategory._id,
      });

      newSubCategory.save();
      res.status(200).json({ message: 'Category added successfully' });
    }
  } catch (error) {
    const myError = error as catchError;
    if (myError.code === 11000) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }
    res.status(500).json({ message: 'Error adding category' });
  }
};

const editCategories = async (req: Request, res: Response) => {
  try {
    const { _id, name, catId, catName } = req.body;

    await subcategoryModel.findByIdAndUpdate(_id, {
      name,
      category: catId,
    });

    const category = await categoryModel.findByIdAndUpdate(catId, {
      name: catName,
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // const subcategories = await subcategoryModel.find({
    //   category: category._id,
    // });

    // const updatedCategory = { ...category.toObject(), subcategories };

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

const archiveCategory = async (req: Request, res: Response) => {
  try {
    const { subcategoryId } = req.body;
    console.log(subcategoryId);

    await subcategoryModel.findByIdAndUpdate(subcategoryId, {
      status: 'Blocked',
    });
    res.status(200).json({ message: 'Category archived successfully' });
  } catch (error) {
    console.error('Failed to archive category:', error);
  }
};

const unarchiveCategory = async (req: Request, res: Response) => {
  try {
    const { subcategoryId } = req.body;

    await subcategoryModel.findByIdAndUpdate(subcategoryId, {
      status: 'Active',
    });
    res.status(200).json({ message: 'Category unarchived successfully' });
  } catch (error) {
    console.error('Failed to unarchive category:', error);
  }
};

const getTopCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel
      .find({ status: 'Active' })
      .sort({ soldCount: -1 })
      .limit(10);

    res.status(200).json(categories);
    console.log(categories);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    res.status(500).json({ message: 'Failed to fetch top categories' });
  }
};

export default {
  getCategories,
  addCategory,
  editCategories,
  archiveCategory,
  unarchiveCategory,
  getTopCategories,
};
