const { db } = require('../database');

const getAllProducts = (req, res) => {
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
};

const getProductById = (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    });
};

const getProductsByCategory = (req, res) => {
    db.all('SELECT * FROM products WHERE category = ?', [req.params.category], (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

const getDeals = (req, res) => {
    db.all('SELECT * FROM products WHERE is_sale = 1 OR discount > 0 LIMIT 6', (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

const getNewArrivals = (req, res) => {
    db.all('SELECT * FROM products WHERE is_new = 1 LIMIT 8', (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

const getTopRated = (req, res) => {
    db.all('SELECT * FROM products ORDER BY rating DESC LIMIT 8', (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

module.exports = { getAllProducts, getProductById, getProductsByCategory, getDeals, getNewArrivals, getTopRated };