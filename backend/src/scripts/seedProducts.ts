import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
});

export const MOCK_PRODUCTS = [
    // Fresh Produce (1)
    { id: 101, name: "Fresh Premium Apples (1kg)", description: "Crisp and juicy sweet apples.", price: 2500, compare_price: 3200, image_url: "/images/mock/apples.png", stock: 50, category_id: 1 },
    { id: 102, name: "Organic Green Bananas", description: "Freshly ripe bananas per bunch.", price: 1200, image_url: "/images/cat_produce.png", stock: 120, category_id: 1 },
    
    // Bakery & Bread (2)
    { id: 201, name: "Fresh Artisanal Loaf", description: "Warm freshly baked bakery bread.", price: 1800, image_url: "/images/mock/bread.png", stock: 15, category_id: 2 },
    { id: 202, name: "Butter Croissants (4 Pack)", description: "Flaky fresh butter pastries.", price: 3400, compare_price: 4000, image_url: "/images/cat_bakery.png", stock: 25, category_id: 2 },
    
    // Dairy & Eggs (3)
    { id: 301, name: "Classic Pure Butter Block", description: "Rich cream butter blocks.", price: 3800, image_url: "/images/mock/butter.png", stock: 0, category_id: 3 },
    { id: 302, name: "Farm Fresh Eggs (6 Pack)", description: "Brown large farm eggs.", price: 1400, image_url: "/images/mock/eggs.png", stock: 35, category_id: 3 },
    
    // Meat & Seafood (4)
    { id: 401, name: "Premium Beef Steak (500g)", description: "High quality prime cut beef.", price: 9500, image_url: "/images/cat_meat.png", stock: 12, category_id: 4 },
    { id: 402, name: "Fresh Atlantic Salmon (300g)", description: "Rich buttery fresh fish fillet.", price: 12000, compare_price: 15000, image_url: "/images/cat_meat.png", stock: 8, category_id: 4 },
    
    // Pantry Staples (5)
    { id: 501, name: "Golden Grain Cereal Box", description: "Healthy breakfast cereal.", price: 5000, image_url: "/images/mock/cereal.png", stock: 120, category_id: 5 },
    { id: 502, name: "Jasmine Long Grain Rice (2kg)", description: "Premium aromatic white rice.", price: 6500, image_url: "/images/cat_pantry.png", stock: 200, category_id: 5 },
    
    // Snacks & Sweets (6)
    { id: 601, name: "Roasted Almond Nuts (500g)", description: "Crunchy salted almonds.", price: 8500, compare_price: 10000, image_url: "/images/mock/almonds.png", stock: 10, category_id: 6 },
    { id: 602, name: "Milk Chocolate Bar (100g)", description: "Creamy solid artisan chocolate.", price: 2100, image_url: "/images/cat_snacks.png", stock: 85, category_id: 6 },
    
    // Beverages (7)
    { id: 701, name: "Organic Orange Juice (1L)", description: "100% natural cold pressed.", price: 4200, compare_price: 4500, image_url: "/images/mock/juice.png", stock: 35, category_id: 7 },
    { id: 702, name: "Spring Water (24 Pack)", description: "Purified bottled spring water.", price: 2200, image_url: "/images/mock/water.png", stock: 200, category_id: 7 },
    
    // Clothing (8)
    { id: 801, name: "Plain White Cotton T-Shirt", description: "Premium comfy cotton standard fit.", price: 7500, image_url: "/images/mock/tshirt.png", stock: 150, category_id: 8 },
    { id: 802, name: "Classic Blue Denim Jeans", description: "Rugged standard fit casual jeans.", price: 18500, compare_price: 22000, image_url: "/images/cat_clothing.png", stock: 45, category_id: 8 },
    
    // Electronics (9)
    { id: 901, name: "Modern Kitchen Blender Pro", description: "High-speed multi-function mixing appliance.", price: 35000, compare_price: 45000, image_url: "/images/mock/blender.png", stock: 12, category_id: 9 },
    { id: 902, name: "4K Smart LED TV (55 Inch)", description: "Ultra HD smart entertainment television.", price: 245000, image_url: "/images/cat_electronics.png", stock: 5, category_id: 9 },
    
    // Home & Kitchen (10)
    { id: 1001, name: "Non-Stick Frying Pan (28cm)", description: "Durable ceramic coated pan.", price: 14500, image_url: "/images/cat_kitchen.png", stock: 22, category_id: 10 },
    { id: 1002, name: "Stainless Steel Utensil Set", description: "Premium cooking utensil bundle.", price: 9200, image_url: "/images/cat_kitchen.png", stock: 18, category_id: 10 },
    
    // Health & Beauty (11)
    { id: 1101, name: "Gentle Care Skin Shampoo", description: "Deeply moisturizing hair and scalp care.", price: 2800, image_url: "/images/mock/shampoo.png", stock: 42, category_id: 11 },
    { id: 1102, name: "Organic Vitamin C Serum", description: "Brightening daily face serum.", price: 6800, compare_price: 8000, image_url: "/images/cat_beauty.png", stock: 30, category_id: 11 },
    
    // Baby Care (12)
    { id: 1201, name: "Soft Baby Diapers (50 Pack)", description: "Ultra-absorbent sensitive care diapers.", price: 8500, image_url: "/images/cat_baby.png", stock: 65, category_id: 12 },
    { id: 1202, name: "Organic Baby Formula Milk", description: "Nutritional toddler milk powder.", price: 11000, image_url: "/images/cat_baby.png", stock: 15, category_id: 12 },
    
    // Pet Supplies (13)
    { id: 1301, name: "Premium Dry Dog Food", description: "Nutritious balanced meal for canines.", price: 12500, image_url: "/images/mock/dogfood.png", stock: 18, category_id: 13 },
    { id: 1302, name: "Cat Grooming Brush", description: "Gentle slicker brush for felines.", price: 3400, image_url: "/images/cat_pets.png", stock: 40, category_id: 13 },
    
    // Household (14)
    { id: 1401, name: "Multipurpose Cleaning Spray", description: "Antibacterial surface cleaner.", price: 1900, image_url: "/images/cat_household.png", stock: 80, category_id: 14 },
    { id: 1402, name: "Heavy Duty Trash Bags", description: "Large thick 30 bag roll.", price: 2400, image_url: "/images/cat_household.png", stock: 110, category_id: 14 }
];

const CATEGORIES = [
    { id: 1, name: "Fresh Produce" },
    { id: 2, name: "Bakery & Bread" },
    { id: 3, name: "Dairy & Eggs" },
    { id: 4, name: "Meat & Seafood" },
    { id: 5, name: "Pantry Staples" },
    { id: 6, name: "Snacks & Sweets" },
    { id: 7, name: "Beverages" },
    { id: 8, name: "Clothing" },
    { id: 9, name: "Electronics" },
    { id: 10, name: "Home & Kitchen" },
    { id: 11, name: "Health & Beauty" },
    { id: 12, name: "Baby Care" },
    { id: 13, name: "Pet Supplies" },
    { id: 14, name: "Household" }
];

client.connect().then(async () => {
    try {
        console.log("Seeding real mock categories massively...");
        for (const cat of CATEGORIES) {
            const chk = await client.query('SELECT id FROM categories WHERE id = $1', [cat.id]);
            if (chk.rows.length === 0) {
                 const generatedSlug = cat.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
                 await client.query('INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3)', [cat.id, cat.name, generatedSlug]);
            }
        }
        await client.query("SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));");
        
        console.log("Seeding real mock products massively...");
        for (const p of MOCK_PRODUCTS) {
            // Check if exists
            const chk = await client.query('SELECT id FROM products WHERE id = $1', [p.id]);
            const imgJSON = JSON.stringify([p.image_url]);
            const discount = (p.compare_price && p.compare_price > p.price) ? (p.compare_price - p.price) : 0;
            
            if (chk.rows.length === 0) {
                await client.query(
                    `INSERT INTO products (id, name, description, price, discount, category_id, stock_quantity, images, status, is_featured) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', true)`,
                    [p.id, p.name, p.description, p.price, discount, p.category_id, p.stock, imgJSON]
                );
            } else {
                await client.query(
                    `UPDATE products SET name=$2, description=$3, price=$4, discount=$5, category_id=$6, stock_quantity=$7, images=$8 WHERE id=$1`,
                     [p.id, p.name, p.description, p.price, discount, p.category_id, p.stock, imgJSON]
                );
            }
        }
        await client.query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));");
        console.log("Fully secured all products persistently.");
    } catch(e) {
        console.error("Insertion failed:", e);
    } finally {
        process.exit(0);
    }
});
