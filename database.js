const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

const initDatabase = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            subcategory TEXT,
            price REAL,
            original_price REAL,
            discount INTEGER,
            image TEXT,
            hover_image TEXT,
            stock INTEGER,
            rating REAL,
            description TEXT,
            is_new INTEGER DEFAULT 0,
            is_sale INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER DEFAULT 1,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE,
            user_id INTEGER,
            total_amount REAL,
            status TEXT DEFAULT 'pending',
            shipping_address TEXT,
            billing_address TEXT,
            payment_method TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
            if (err) {
                console.error('Error checking products:', err);
                return;
            }
            
            if (row.count === 0) {
                const sampleProducts = [
                    ['Mens Winter Leathers Jackets', 'jacket', 'mens', 48.00, 75.00, 15, '/assets/images/products/jacket-3.jpg', '/assets/images/products/jacket-4.jpg', 50, 4.5, 'Premium leather jacket for winter', 0, 1],
                    ['Pure Garment Dyed Cotton Shirt', 'shirt', 'mens', 45.00, 56.00, 10, '/assets/images/products/shirt-1.jpg', '/assets/images/products/shirt-2.jpg', 60, 4.0, 'High quality cotton shirt', 1, 0],
                    ['MEN Yarn Fleece Full-Zip Jacket', 'jacket', 'mens', 58.00, 65.00, 7, '/assets/images/products/jacket-5.jpg', '/assets/images/products/jacket-6.jpg', 40, 4.8, 'Warm fleece jacket', 0, 1],
                    ['Black Floral Wrap Midi Skirt', 'skirt', 'womens', 25.00, 35.00, 10, '/assets/images/products/clothes-3.jpg', '/assets/images/products/clothes-4.jpg', 80, 5.0, 'Elegant floral skirt', 1, 0],
                    ['Casual Mens Brown Shoes', 'casual', 'mens', 99.00, 105.00, 5, '/assets/images/products/shoe-2.jpg', '/assets/images/products/shoe-2_1.jpg', 30, 4.5, 'Comfortable casual shoes', 0, 1],
                    ['Pocket Watch Leather Pouch', 'watches', 'accessories', 150.00, 170.00, 12, '/assets/images/products/watch-3.jpg', '/assets/images/products/watch-4.jpg', 25, 4.2, 'Classic pocket watch', 0, 1],
                    ['Smart Watch Vital Plus', 'watches', 'electronics', 100.00, 120.00, 17, '/assets/images/products/watch-1.jpg', '/assets/images/products/watch-2.jpg', 45, 4.3, 'Smart fitness watch', 1, 0],
                    ['Womens Party Wear Shoes', 'party wear', 'womens', 25.00, 30.00, 5, '/assets/images/products/party-wear-1.jpg', '/assets/images/products/party-wear-2.jpg', 35, 4.0, 'Stylish party heels', 0, 1],
                    ['Trekking & Running Shoes - black', 'sports', 'mens', 58.00, 64.00, 6, '/assets/images/products/sports-2.jpg', '/assets/images/products/sports-4.jpg', 55, 4.4, 'Durable sports shoes', 0, 1],
                    ['Mens Leather Formal Wear shoes', 'formal', 'mens', 50.00, 65.00, 15, '/assets/images/products/shoe-1.jpg', '/assets/images/products/shoe-1_1.jpg', 40, 4.6, 'Premium formal shoes', 0, 1],
                    ['Better Basics French Terry Sweatshorts', 'shorts', 'mens', 78.00, 85.00, 7, '/assets/images/products/shorts-1.jpg', '/assets/images/products/shorts-2.jpg', 60, 4.2, 'Comfortable sweatshorts', 0, 1],
                    ['Rose Gold Diamonds Earring', 'jewellery', 'womens', 1990.00, 2000.00, 0, '/assets/images/products/jewellery-1.jpg', '/assets/images/products/jewellery-1.jpg', 10, 4.9, 'Luxury diamond earrings', 0, 0]
                ];

                const insertStmt = db.prepare(`INSERT INTO products (name, category, subcategory, price, original_price, discount, image, hover_image, stock, rating, description, is_new, is_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                sampleProducts.forEach(product => insertStmt.run(product));
                insertStmt.finalize();
                console.log('Sample products inserted');
            }
        });
    });
};

module.exports = { db, initDatabase };