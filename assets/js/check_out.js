let cartItems = [];
    let selectedPayment = 'cod';
    let currentAddressTab = 'billing';
    
    // Products data
    const productsData = [
        { id: 1, name: "Mens Winter Leathers Jackets", price: 48.00, image: "./assets/images/products/jacket-3.jpg" },
        { id: 2, name: "Pure Garment Dyed Cotton Shirt", price: 45.00, image: "./assets/images/products/shirt-1.jpg" },
        { id: 3, name: "MEN Yarn Fleece Full-Zip Jacket", price: 58.00, image: "./assets/images/products/jacket-5.jpg" },
        { id: 4, name: "Black Floral Wrap Midi Skirt", price: 25.00, image: "./assets/images/products/clothes-3.jpg" },
        { id: 5, name: "Casual Mens Brown Shoes", price: 99.00, image: "./assets/images/products/shoe-2.jpg" },
        { id: 6, name: "Pocket Watch Leather Pouch", price: 150.00, image: "./assets/images/products/watch-3.jpg" },
        { id: 7, name: "Smart Watch Vital Plus", price: 100.00, image: "./assets/images/products/watch-1.jpg" },
        { id: 8, name: "Womens Party Wear Shoes", price: 25.00, image: "./assets/images/products/party-wear-1.jpg" },
        { id: 9, name: "Trekking & Running Shoes", price: 58.00, image: "./assets/images/products/sports-2.jpg" },
        { id: 10, name: "Mens Leather Formal Shoes", price: 50.00, image: "./assets/images/products/shoe-1.jpg" },
        { id: 11, name: "French Terry Sweatshorts", price: 78.00, image: "./assets/images/products/shorts-1.jpg" },
        { id: 12, name: "Rose Gold Diamonds Earring", price: 1990.00, image: "./assets/images/products/jewellery-1.jpg" }
    ];

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
        }
        if (cartItems.length === 0) {
            document.getElementById('cartItemsList').innerHTML = `
                <div class="empty-cart">
                    <ion-icon name="bag-outline"></ion-icon>
                    <p>Your cart is empty</p>
                    <a href="../index.html" style="color: #ff6b6b;">Continue Shopping</a>
                </div>
            `;
        } else {
            displayCartItems();
        }
        calculateTotal();
    }

    // Display cart items with quantity controls
    function displayCartItems() {
        const container = document.getElementById('cartItemsList');
        if (!cartItems.length) return;
        
        let html = '';
        cartItems.forEach((item, index) => {
            const product = productsData.find(p => p.id === item.product_id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                html += `
                    <div class="cart-item" data-index="${index}">
                        <img src="${product.image}" class="cart-item-img" alt="${product.name}">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${product.name}</div>
                            <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                            <div class="cart-item-controls">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="item-quantity" id="qty-${item.id}">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                            </div>
                        </div>
                        <div style="font-weight: bold; min-width: 70px; text-align: right;">
                            $${itemTotal.toFixed(2)}
                        </div>
                    </div>
                `;
            }
        });
        container.innerHTML = html;
    }

    // Update quantity
    function updateQuantity(itemId, change) {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        const newQuantity = cartItems[itemIndex].quantity + change;
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }
        
        cartItems[itemIndex].quantity = newQuantity;
        saveCartToLocalStorage();
        displayCartItems();
        calculateTotal();
        showNotification('Cart updated', 'success');
    }

    // Remove item from cart
    function removeItem(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        saveCartToLocalStorage();
        if (cartItems.length === 0) {
            document.getElementById('cartItemsList').innerHTML = `
                <div class="empty-cart">
                    <ion-icon name="bag-outline"></ion-icon>
                    <p>Your cart is empty</p>
                    <a href="../index.html" style="color: #ff6b6b;">Continue Shopping</a>
                </div>
            `;
        } else {
            displayCartItems();
        }
        calculateTotal();
        showNotification('Item removed from cart', 'info');
    }

    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Calculate totals
    function calculateTotal() {
        let subtotal = 0;
        cartItems.forEach(item => {
            const product = productsData.find(p => p.id === item.product_id);
            if (product) {
                subtotal += product.price * item.quantity;
            }
        });
        
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.05; // 5% GST
        const total = subtotal + shipping + tax;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    }

    // Select payment method
    function selectPayment(method) {
        selectedPayment = method;
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    }

    // Show address form (Billing/Shipping)
    function showAddressForm(type) {
        currentAddressTab = type;
        const billingForm = document.getElementById('billingAddressForm');
        const shippingForm = document.getElementById('shippingAddressForm');
        const tabs = document.querySelectorAll('.address-tab');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        
        if (type === 'billing') {
            billingForm.style.display = 'block';
            shippingForm.style.display = 'none';
            tabs[0].classList.add('active');
        } else {
            billingForm.style.display = 'none';
            shippingForm.style.display = 'block';
            tabs[1].classList.add('active');
        }
    }

    // Toggle shipping address (same as billing)
    function toggleShippingAddress() {
        const isSame = document.getElementById('sameAsBilling').checked;
        const shippingFields = document.getElementById('shippingFields');
        
        if (isSame) {
            shippingFields.style.opacity = '0.5';
            shippingFields.style.pointerEvents = 'none';
        } else {
            shippingFields.style.opacity = '1';
            shippingFields.style.pointerEvents = 'auto';
        }
    }

    // Get address data
    function getAddressData() {
        let billingAddress = {
            fullName: document.getElementById('billFullName').value,
            email: document.getElementById('billEmail').value,
            mobile: document.getElementById('billMobile').value,
            address: document.getElementById('billAddress').value,
            city: document.getElementById('billCity').value,
            state: document.getElementById('billState').value,
            pincode: document.getElementById('billPincode').value,
            country: document.getElementById('billCountry').value
        };
        
        let shippingAddress;
        const isSameAsBilling = document.getElementById('sameAsBilling')?.checked;
        
        if (isSameAsBilling || currentAddressTab === 'billing') {
            shippingAddress = { ...billingAddress };
        } else {
            shippingAddress = {
                fullName: document.getElementById('shipFullName').value,
                mobile: document.getElementById('shipMobile').value,
                address: document.getElementById('shipAddress').value,
                city: document.getElementById('shipCity').value,
                state: document.getElementById('shipState').value,
                pincode: document.getElementById('shipPincode').value,
                country: 'India'
            };
        }
        
        return { billingAddress, shippingAddress };
    }

    // Validate address
    function validateAddress(address, isBilling = true) {
        if (isBilling) {
            if (!address.fullName) return 'Please enter full name';
            if (!address.email) return 'Please enter email';
            if (!address.mobile || address.mobile.length !== 10) return 'Please enter valid 10-digit mobile number';
            if (!address.address) return 'Please enter address';
            if (!address.city) return 'Please enter city';
            if (!address.state) return 'Please enter state';
            if (!address.pincode || address.pincode.length !== 6) return 'Please enter valid 6-digit pincode';
        } else {
            if (!address.fullName) return 'Please enter shipping full name';
            if (!address.mobile || address.mobile.length !== 10) return 'Please enter valid shipping mobile number';
            if (!address.address) return 'Please enter shipping address';
            if (!address.city) return 'Please enter shipping city';
            if (!address.state) return 'Please enter shipping state';
            if (!address.pincode || address.pincode.length !== 6) return 'Please enter valid shipping pincode';
        }
        return null;
    }

    // Place order
    function placeOrder() {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const { billingAddress, shippingAddress } = getAddressData();
        
        // Validate billing address
        const billingError = validateAddress(billingAddress, true);
        if (billingError) {
            alert(billingError);
            showAddressForm('billing');
            return;
        }
        
        // Validate shipping address if needed
        if (currentAddressTab === 'shipping' && !document.getElementById('sameAsBilling')?.checked) {
            const shippingError = validateAddress(shippingAddress, false);
            if (shippingError) {
                alert(shippingError);
                showAddressForm('shipping');
                return;
            }
        }
        
        // Calculate totals
        let subtotal = 0;
        cartItems.forEach(item => {
            const product = productsData.find(p => p.id === item.product_id);
            if (product) subtotal += product.price * item.quantity;
        });
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;
        
        // Create order object
        const order = {
            orderId: 'ORD' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase(),
            date: new Date().toLocaleString(),
            items: cartItems.map(item => {
                const product = productsData.find(p => p.id === item.product_id);
                return {
                    id: item.id,
                    product_id: item.product_id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    image: product.image,
                    total: product.price * item.quantity
                };
            }),
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total,
            paymentMethod: selectedPayment.toUpperCase(),
            billingAddress: billingAddress,
            shippingAddress: shippingAddress,
            status: 'Confirmed',
            estimatedDelivery: '3-5 business days'
        };
        
        // Save order
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Show success message
        let paymentMethodText = '';
        if (selectedPayment === 'cod') paymentMethodText = 'Cash on Delivery';
        else if (selectedPayment === 'card') paymentMethodText = 'Credit/Debit Card';
        else paymentMethodText = 'UPI / Net Banking';
        
        alert(`✅ ORDER PLACED SUCCESSFULLY!\n\n📦 Order ID: ${order.orderId}\n📅 Date: ${order.date}\n💰 Total Amount: $${total.toFixed(2)}\n💳 Payment: ${paymentMethodText}\n\n📍 Shipping to:\n${shippingAddress.fullName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\n\n🚚 Estimated Delivery: ${order.estimatedDelivery}\n\nThank you for shopping with FlipAlpha! 🎉`);
        
        // Redirect to home
        window.location.href = 'index.html';
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; 
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white; padding: 12px 20px; border-radius: 8px; 
            z-index: 10000; animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Initialize
    loadCart();
    
    // Make functions global
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.selectPayment = selectPayment;
    window.placeOrder = placeOrder;
    window.showAddressForm = showAddressForm;
    window.toggleShippingAddress = toggleShippingAddress;