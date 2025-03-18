import Category from "../../Models/categoriesModel.js";
import { Router } from "express";
import { faker } from "@faker-js/faker";

const CategoriesRouter = new Router();

// OPTIONS Routes
CategoriesRouter.options('/', (req, res) => {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    res.status(204).end();
});

CategoriesRouter.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.status(204).end();
});

// Create Category
CategoriesRouter.post('/', async (req, res) => {
    const { categoryName, lesson } = req.body;

    if (!categoryName) {
        return res.status(400).json({
            message: 'Missing or empty required field (name)',
        });
    }
    if (!lesson) {
        return res.status(404).json({
            message: 'Lesson not found',
        });
    }

    const category = new Category({ categoryName, lesson });

    try {
        await category.save();
        res.status(201).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

// Get Category by ID
CategoriesRouter.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
});

// Update Category
CategoriesRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    const categoryToUpdate = await Category.findById(id);

    if (!categoryToUpdate) {
        return res.status(404).json({ message: 'Category not found' });
    }

    if (!categoryName) {
        return res.status(400).json({
            message: 'Missing or empty required fields (name)',
        });
    }

    categoryToUpdate.categoryName = categoryName;


    try {
        await categoryToUpdate.save();
        res.status(201).json({ categoryToUpdate });
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

// Delete Category
CategoriesRouter.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category deleted successfully',
            category: deletedCategory,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

// Get All Categories
CategoriesRouter.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
            .populate([
                {path: 'categorySigns', select: 'title image lesson_id'},
                {path: 'categoryExercises', select: 'type question answer'}
            ]);
        res.status(200).json({
            "items": categories,
            "_links": {
                "self": {
                    "href": `${process.env.SELF_LINK}/Categories`
                },
                "collection": {
                    "href": `${process.env.SELF_LINK}/Categories`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

export default CategoriesRouter;
