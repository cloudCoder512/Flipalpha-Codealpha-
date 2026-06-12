let wishlistData = [];
    let productsData = [
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
    
    function loadWishlist() {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            wishlistData = JSON.parse(savedWishlist);
        }
        displayWishlist();
    }
    
    function displayWishlist() {
        const container = document.getElementById('wishlistGrid');
        
        if (wishlistData.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist" style="grid-column: 1/-1;">
                    <h3>Your wishlist is empty</h3>
                    <p>Save your favorite items here for later purchase</p>
                    <a href="index.html" class="btn-shop">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        for (let i = 0; i < wishlistData.length; i++) {
            const item = wishlistData[i];
            const product = productsData.find(p => p.id === item.product_id);
            if (product) {
                html += `
                    <div class="wishlist-card">
                        <img src="${product.image}" class="product-image" alt="${product.name}">
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <div class="product-actions">
                                <button class="btn-add-cart" onclick="addToCartAndRemove(${product.id}, ${item.id})">Add to Cart</button>
                                <button class="btn-remove" onclick="removeFromWishlist(${item.id}, ${product.id})">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        container.innerHTML = html;
    }
    
    function addToCartAndRemove(productId, wishlistId) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.product_id === productId);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            const product = productsData.find(p => p.id === productId);
            cart.push({
                id: Date.now(),
                product_id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        wishlistData = wishlistData.filter(item => item.id !== wishlistId);
        localStorage.setItem('wishlist', JSON.stringify(wishlistData));
        
        displayWishlist();
        updateCartCount();
        showMessage('Item moved to cart successfully');
    }
    
    function removeFromWishlist(wishlistId, productId) {
        wishlistData = wishlistData.filter(item => item.id !== wishlistId);
        localStorage.setItem('wishlist', JSON.stringify(wishlistData));
        displayWishlist();
        updateWishlistCount();
        showMessage('Item removed from wishlist');
    }
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll('.count');
        cartCounts.forEach(el => {
            const parent = el.closest('.action-btn');
            if (parent && parent.querySelector('ion-icon[name="bag-handle-outline"]')) {
                el.textContent = total;
            }
        });
    }
    
    function updateWishlistCount() {
        const count = wishlistData.length;
        const wishlistCounts = document.querySelectorAll('.count');
        wishlistCounts.forEach(el => {
            const parent = el.closest('.action-btn');
            if (parent && parent.querySelector('ion-icon[name="heart-outline"]')) {
                el.textContent = count;
            }
        });
    }
    
    function showMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;padding:12px 20px;border-radius:8px;z-index:10000;';
        msgDiv.innerText = message;
        document.body.appendChild(msgDiv);
        setTimeout(() => msgDiv.remove(), 2000);
    }
    
    loadWishlist();