import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { pool } from '../config/db';

// ### PRODUCT CONTROLLERS ###
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, discount, category_id, stock_quantity, status, is_featured } = req.body;
        
        // Express.Multer.File typing requires parsing from setup
        const files = req.files as Express.Multer.File[];
        const images = files ? files.map(file => file.path) : [];

        const newProduct = await Product.create({
            name, description, price, discount, 
            category_id, stock_quantity, 
            images: JSON.stringify(images), 
            status, is_featured
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({ message: 'Internal error while creating product' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal error fetching products' });
    }
};

export const getPublicProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.getPublicFiltered(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal error actively filtering storefront metrics natively.' });
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const identifier = req.params.id as string;
        const product = await Product.getByIdOrSlug(identifier);
        if(!product) return res.status(404).json({ message: 'Product structurally absent.' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal error fetching isolated catalog entity natively.' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deleted = await Product.delete(Number(req.params.id));
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted', product: deleted });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// ### CATEGORY CONTROLLERS ###
export const updateProductStock = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { stock_quantity } = req.body;
        const result = await pool.query('UPDATE products SET stock_quantity = $1 WHERE id = $2 RETURNING *', [stock_quantity, id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(result.rows[0]);
    } catch(e) {
        res.status(500).json({ message: 'Error updating stock constraints locally.' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const newCat = await Category.create(name, slug);
        res.status(201).json(newCat);
    } catch (error: any) {
        if (error.code === '23505') { // Unique constraint violation in PG
            return res.status(400).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: 'Internal error' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};
