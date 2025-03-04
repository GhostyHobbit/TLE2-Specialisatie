import Category from "../Models/Categories.js"; // Assuming you have a Category model
import { Router } from "express";
import { faker } from "@faker-js/faker";

const CategoriesRouter = new Router();

// OPTIONS Routes
CategoriesRouter.options('/Categories', (req, res) => {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    res.status(204).end();
});

CategoriesRouter.options('/Categories/:id', (req, res) => {
    res.setHeader('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.status(204).end();
});

// Seed Route
CategoriesRouter.post('/Categories/seed/:id', async (req, res) => {
    // Add seed logic for categories
});

// Create Category
CategoriesRouter.post('/Categories', async (req, res) => {
    const { name, description, method } = req.body;
    const categoryAmount = req.body.amount;

    if(method === "SEED") {
        await Category.deleteMany({}); // Clear categories for seeding
        for (let i = 1; i <= categoryAmount; i++) {
            let fakeCategory = new Category({
                name: faker.commerce.department(), // Fake category name
                description: faker.lorem.sentence(), // Fake category description
            });

            await fakeCategory.save();
        }

        res.json({
            message: 'Categories seeded successfully',
        });
        return; // Return after seeding to prevent further execution
    }

    if (!name || !description) {
        return res.status(400).json({
            message: 'Missing or empty required fields (name, description)',
        });
    }

    const category = new Category({ name, description });

    try {
        await category.save();
        res.status(201).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

// Get Category by ID
CategoriesRouter.get('/Categories/:id', async (req, res) => {
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
CategoriesRouter.put('/Categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const categoryToUpdate = await Category.findById(id);

    if (!categoryToUpdate) {
        return res.status(404).json({ message: 'Category not found' });
    }

    if (!name || !description) {
        return res.status(400).json({
            message: 'Missing or empty required fields (name, description)',
        });
    }

    categoryToUpdate.name = name;
    categoryToUpdate.description = description;

    try {
        await categoryToUpdate.save();
        res.status(201).json({ categoryToUpdate });
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });
    }
});

// Delete Category
CategoriesRouter.delete('/Categories/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(204).json({
            message: 'Category deleted successfully',
            category: deletedCategory,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

// Get All Categories
CategoriesRouter.get('/Categories', async (req, res) => {
    try {
        const categories = await Category.find({});
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
