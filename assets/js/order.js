function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const container = document.getElementById('ordersList');
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="no-orders">
                    <ion-icon name="bag-outline" style="font-size: 60px; color: #ccc;"></ion-icon>
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here</p>
                    <a href="index.html" class="btn-home" style="display: inline-block; margin-top: 20px; background: var(--salmon-pink); color: white; padding: 10px 25px; border-radius: 25px; text-decoration: none;">Shop Now</a>
                </div>
            `;
            return;
        }
        let html = '';
        orders.reverse().forEach(order => {
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <strong>Order #${order.orderId}</strong>
                            <div style="font-size: 12px; margin-top: 5px;">${order.date}</div>
                        </div>
                        <div class="order-status">${order.status.toUpperCase()}</div>
                    </div>
                    <div class="order-body">
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" class="order-item-img">
                                    <div class="order-item-details">
                                        <div><strong>${item.name}</strong></div>
                                        <div>$${item.price.toFixed(2)} x ${item.quantity}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="price-details">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span>Subtotal:</span>
                                <span>$${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span>Shipping:</span>
                                <span>${order.shipping === 0 ? 'FREE' : '$' + order.shipping.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                                <span>Total:</span>
                                <span>$${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="order-address">
                            <strong>Delivery Address:</strong><br>
                            ${order.deliveryAddress.fullName}<br>
                            ${order.deliveryAddress.address}<br>
                            ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}<br>
                            Mobile: ${order.deliveryAddress.mobile}
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    loadOrders();