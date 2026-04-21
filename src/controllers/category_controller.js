const Category = require("../models/category_model");

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        if (!name || !icon || !color) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const category = new Category({ name, icon, color });
        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message,
        });
    }
};

// Get All Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
        });
    }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching category",
        });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, icon, color },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated",
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
        });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
        });
    }
};