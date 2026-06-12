const { db } = require('../database');

const createOrder = (req, res) => {
    const { user_id, items, total_amount, shipping_address, billing_address, payment_method } = req.body;
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    db.run('BEGIN TRANSACTION');

    db.run('INSERT INTO orders (order_number, user_id, total_amount, shipping_address, billing_address, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
        [orderNumber, user_id, total_amount, JSON.stringify(shipping_address), JSON.stringify(billing_address), payment_method], function(err) {
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
};

const getUserOrders = (req, res) => {
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
};

module.exports = { createOrder, getUserOrders };