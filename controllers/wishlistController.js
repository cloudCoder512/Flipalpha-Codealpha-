const { db } = require('../database');

const getWishlist = (req, res) => {
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
};

const addToWishlist = (req, res) => {
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
};

const removeFromWishlist = (req, res) => {
    db.run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.params.userId, req.params.productId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Removed from wishlist' });
    });
};

const getWishlistCount = (req, res) => {
    db.get('SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?', [req.params.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: result.count || 0 });
    });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, getWishlistCount };