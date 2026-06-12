const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'ecommerce-secret-key-2024',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

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
                ['Rose Gold Diamonds Earring', 'jewellery', 'womens', 1990.00, 2000.00, 0, '/assets/images/products/jewellery-1.jpg', '/assets/images/products/jewellery-1.jpg', 10, 4.9, 'Luxury diamond earrings', 0, 0],
                ['Running & Trekking Shoes - White', 'sports', 'mens', 49.00, 15.00, 0, '/assets/images/products/sports-1.jpg', '/assets/images/products/sports-1.jpg', 70, 4.7, 'Lightweight running shoes', 1, 0],
                ['Silver Deer Heart Necklace', 'jewellery', 'womens', 84.00, 30.00, 0, '/assets/images/products/jewellery-3.jpg', '/assets/images/products/jewellery-3.jpg', 20, 4.8, 'Beautiful silver necklace', 0, 0],
                ['Titan 100 Ml Womens Perfume', 'perfume', 'womens', 42.00, 10.00, 0, '/assets/images/products/perfume.jpg', '/assets/images/products/perfume.jpg', 100, 4.5, 'Luxury perfume', 0, 0]
            ];

            const insertStmt = db.prepare(`INSERT INTO products (name, category, subcategory, price, original_price, discount, image, hover_image, stock, rating, description, is_new, is_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            sampleProducts.forEach(product => insertStmt.run(product));
            insertStmt.finalize();
            console.log('Sample products inserted successfully');
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Registration failed' });
        }
        res.json({ success: true, message: 'Registration successful', userId: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 'jwt-secret-key', { expiresIn: '24h' });
        req.session.userId = user.id;
        
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

app.get('/api/products', (req, res) => {
    const { category, search, sort, limit } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];
    let conditions = [];

    if (category && category !== 'all') {
        conditions.push('category = ?');
        params.push(category);
    }

    if (search) {
        conditions.push('(name LIKE ? OR category LIKE ? OR subcategory LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'price_asc') {
        query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
        query += ' ORDER BY price DESC';
    } else if (sort === 'newest') {
        query += ' ORDER BY id DESC';
    } else if (sort === 'rating') {
        query += ' ORDER BY rating DESC';
    } else {
        query += ' ORDER BY id DESC';
    }

    if (limit) {
        query += ' LIMIT ?';
        params.push(parseInt(limit));
    }

    db.all(query, params, (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    });
});

app.get('/api/categories/:category', (req, res) => {
    db.all('SELECT * FROM products WHERE category = ?', [req.params.category], (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
});

app.get('/api/deals', (req, res) => {
    db.all('SELECT * FROM products WHERE is_sale = 1 OR discount > 0 LIMIT 6', (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
});

app.get('/api/new-arrivals', (req, res) => {
    db.all('SELECT * FROM products WHERE is_new = 1 LIMIT 8', (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
});

app.get('/api/top-rated', (req, res) => {
    db.all('SELECT * FROM products ORDER BY rating DESC LIMIT 8', (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
});

app.get('/api/cart/:userId', (req, res) => {
    db.all(`
        SELECT c.*, p.name, p.price, p.image, p.stock, p.original_price, p.discount
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `, [req.params.userId], (err, items) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(items);
    });
});

app.post('/api/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, existing) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (existing) {
            db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, message: 'Cart updated' });
            });
        } else {
            db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, message: 'Item added to cart', cartId: this.lastID });
            });
        }
    });
});

app.put('/api/cart/:id', (req, res) => {
    const { quantity } = req.body;
    db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Cart updated' });
    });
});

app.delete('/api/cart/:id', (req, res) => {
    db.run('DELETE FROM cart WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Item removed from cart' });
    });
});

app.get('/api/wishlist/:userId', (req, res) => {
    db.all(`
        SELECT w.*, p.name, p.price, p.image, p.discount, p.original_price
        FROM wishlist w 
        JOIN products p ON w.product_id = p.id 
        WHERE w.user_id = ?
    `, [req.params.userId], (err, items) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(items);
    });
});

app.post('/api/wishlist', (req, res) => {
    const { user_id, product_id } = req.body;

    db.get('SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, existing) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (existing) {
            return res.json({ success: false, message: 'Already in wishlist' });
        }

        db.run('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [user_id, product_id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Added to wishlist' });
        });
    });
});

app.delete('/api/wishlist/:userId/:productId', (req, res) => {
    db.run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.params.userId, req.params.productId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Removed from wishlist' });
    });
});

app.post('/api/orders', (req, res) => {
    const { user_id, items, total_amount, shipping_address, payment_method } = req.body;
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    db.run('BEGIN TRANSACTION');

    db.run('INSERT INTO orders (order_number, user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)',
        [orderNumber, user_id, total_amount, shipping_address, payment_method], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }

            const orderId = this.lastID;
            let completed = 0;
            let hasError = false;

            items.forEach(item => {
                db.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price], (err) => {
                        if (err) {
                            hasError = true;
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err.message });
                        }
                        completed++;
                        if (completed === items.length && !hasError) {
                            db.run('DELETE FROM cart WHERE user_id = ?', [user_id], (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: err.message });
                                }
                                db.run('COMMIT');
                                res.json({ success: true, message: 'Order placed successfully', orderId: orderId, orderNumber: orderNumber });
                            });
                        }
                    });
            });
        });
});

app.get('/api/orders/:userId', (req, res) => {
    db.all(`
        SELECT o.*, 
               GROUP_CONCAT(oi.product_id) as product_ids,
               GROUP_CONCAT(oi.quantity) as quantities
        FROM orders o 
        LEFT JOIN order_items oi ON o.id = oi.order_id 
        WHERE o.user_id = ? 
        GROUP BY o.id 
        ORDER BY o.created_at DESC
    `, [req.params.userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(orders);
    });
});

app.get('/api/cart/count/:userId', (req, res) => {
    db.get('SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE user_id = ?', [req.params.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: result.count || 0 });
    });
});

app.get('/api/wishlist/count/:userId', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?', [req.params.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: result.count || 0 });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('Server is running');
    console.log('Click here to open: \x1b[36m%s\x1b[0m', `http://localhost:${PORT}`);
    console.log('========================================\n');
});