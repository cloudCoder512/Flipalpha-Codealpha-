const { db } = require('../database');

const getCart = (req, res) => {
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
};

const addToCart = (req, res) => {
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
};

const updateCart = (req, res) => {
    const { quantity } = req.body;
    db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Cart updated' });
    });
};

const removeFromCart = (req, res) => {
    db.run('DELETE FROM cart WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Item removed from cart' });
    });
};

const getCartCount = (req, res) => {
    db.get('SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE user_id = ?', [req.params.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: result.count || 0 });
    });
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, getCartCount };