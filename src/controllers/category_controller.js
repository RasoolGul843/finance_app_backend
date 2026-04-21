const Category = require("../models/category_model");

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        if (!name || !icon || !color) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const category = new Category({
            name,
            icon,
            color,
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message,
        });
    }
};

// GET ALL
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET BY ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
const updateCategory = async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({
            success: true,
            message: "Category deleted",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};