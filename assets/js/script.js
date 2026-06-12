'use strict';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { 
    if (modal) modal.classList.add('closed'); 
}

// modal eventListener
if (modalCloseOverlay) modalCloseOverlay.addEventListener('click', modalCloseFunc);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', modalCloseFunc);

// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', function () {
        if (notificationToast) notificationToast.classList.add('closed');
    });
}

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
    const mobileMenuCloseFunc = function () {
        if (mobileMenu[i]) mobileMenu[i].classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    mobileMenuOpenBtn[i].addEventListener('click', function () {
        if (mobileMenu[i]) mobileMenu[i].classList.add('active');
        if (overlay) overlay.classList.add('active');
    });

    if (mobileMenuCloseBtn[i]) mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    if (overlay) overlay.addEventListener('click', mobileMenuCloseFunc);
}

// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {
    accordionBtn[i].addEventListener('click', function () {
        const clickedBtn = this.nextElementSibling.classList.contains('active');
        for (let j = 0; j < accordion.length; j++) {
            if (clickedBtn) break;
            if (accordion[j].classList.contains('active')) {
                accordion[j].classList.remove('active');
                accordionBtn[j].classList.remove('active');
            }
        }
        this.nextElementSibling.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// ============= ECOMMERCE FUNCTIONS =============

let cartItems = [];
let wishlistItems = [];
let productsData = [];

// Sample products
const sampleProducts = [
    { id: 1, name: "Mens Winter Leathers Jackets", category: "jacket", price: 48.00, original_price: 75.00, discount: 15, image: "./assets/images/products/jacket-3.jpg", hover_image: "./assets/images/products/jacket-4.jpg", rating: 4.5, stock: 50, description: "Premium leather jacket for winter", is_new: 0, is_sale: 1 },
    { id: 2, name: "Pure Garment Dyed Cotton Shirt", category: "shirt", price: 45.00, original_price: 56.00, discount: 10, image: "./assets/images/products/shirt-1.jpg", hover_image: "./assets/images/products/shirt-2.jpg", rating: 4.0, stock: 60, description: "High quality cotton shirt", is_new: 1, is_sale: 0 },
    { id: 3, name: "MEN Yarn Fleece Full-Zip Jacket", category: "jacket", price: 58.00, original_price: 65.00, discount: 7, image: "./assets/images/products/jacket-5.jpg", hover_image: "./assets/images/products/jacket-6.jpg", rating: 4.8, stock: 40, description: "Warm fleece jacket", is_new: 0, is_sale: 1 },
    { id: 4, name: "Black Floral Wrap Midi Skirt", category: "skirt", price: 25.00, original_price: 35.00, discount: 10, image: "./assets/images/products/clothes-3.jpg", hover_image: "./assets/images/products/clothes-4.jpg", rating: 5.0, stock: 80, description: "Elegant floral skirt", is_new: 1, is_sale: 0 },
    { id: 5, name: "Casual Mens Brown Shoes", category: "casual", price: 99.00, original_price: 105.00, discount: 5, image: "./assets/images/products/shoe-2.jpg", hover_image: "./assets/images/products/shoe-2_1.jpg", rating: 4.5, stock: 30, description: "Comfortable casual shoes", is_new: 0, is_sale: 1 },
    { id: 6, name: "Pocket Watch Leather Pouch", category: "watches", price: 150.00, original_price: 170.00, discount: 12, image: "./assets/images/products/watch-3.jpg", hover_image: "./assets/images/products/watch-4.jpg", rating: 4.2, stock: 25, description: "Classic pocket watch", is_new: 0, is_sale: 1 },
    { id: 7, name: "Smart Watch Vital Plus", category: "watches", price: 100.00, original_price: 120.00, discount: 17, image: "./assets/images/products/watch-1.jpg", hover_image: "./assets/images/products/watch-2.jpg", rating: 4.3, stock: 45, description: "Smart fitness watch", is_new: 1, is_sale: 0 },
    { id: 8, name: "Womens Party Wear Shoes", category: "party wear", price: 25.00, original_price: 30.00, discount: 5, image: "./assets/images/products/party-wear-1.jpg", hover_image: "./assets/images/products/party-wear-2.jpg", rating: 4.0, stock: 35, description: "Stylish party heels", is_new: 0, is_sale: 1 },
    { id: 9, name: "Trekking & Running Shoes - black", category: "sports", price: 58.00, original_price: 64.00, discount: 6, image: "./assets/images/products/sports-2.jpg", hover_image: "./assets/images/products/sports-4.jpg", rating: 4.4, stock: 55, description: "Durable sports shoes", is_new: 0, is_sale: 1 },
    { id: 10, name: "Mens Leather Formal Wear shoes", category: "formal", price: 50.00, original_price: 65.00, discount: 15, image: "./assets/images/products/shoe-1.jpg", hover_image: "./assets/images/products/shoe-1_1.jpg", rating: 4.6, stock: 40, description: "Premium formal shoes", is_new: 0, is_sale: 1 },
    { id: 11, name: "Better Basics French Terry Sweatshorts", category: "shorts", price: 78.00, original_price: 85.00, discount: 7, image: "./assets/images/products/shorts-1.jpg", hover_image: "./assets/images/products/shorts-2.jpg", rating: 4.2, stock: 60, description: "Comfortable sweatshorts", is_new: 0, is_sale: 1 },
    { id: 12, name: "Rose Gold Diamonds Earring", category: "jewellery", price: 1990.00, original_price: 2000.00, discount: 0, image: "./assets/images/products/jewellery-1.jpg", hover_image: "./assets/images/products/jewellery-1.jpg", rating: 4.9, stock: 10, description: "Luxury diamond earrings", is_new: 0, is_sale: 0 }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    productsData = sampleProducts;
    loadProducts();
    loadNewArrivals();
    loadTopRated();
    loadDeals();
    setupEventListeners();
    setupSearch();
    loadCartFromLocalStorage();
    loadWishlistFromLocalStorage();
    updateCartCountDisplay();
    updateWishlistCountDisplay();
    
    // Fix header cart button
    const cartBtn = document.querySelector('.header-user-actions .action-btn');
    if (cartBtn) {
        cartBtn.onclick = function() {
            showCartModal();
        };
    }
});

// Load all products
function loadProducts(category = 'all', search = '') {
    let filteredProducts = [...productsData];
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            p.category.toLowerCase().includes(search.toLowerCase())
        );
    }
    displayProducts(filteredProducts);
}

// Display products
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    if (products.length === 0) {
        productGrid.innerHTML = '<div class="no-products" style="text-align:center;padding:40px;"><p>No products found</p></div>';
        return;
    }
    productGrid.innerHTML = products.map(product => `
        <div class="showcase">
            <div class="showcase-banner">
                <img src="${product.image}" alt="${product.name}" class="product-img default" width="300">
                <img src="${product.hover_image || product.image}" alt="${product.name}" class="product-img hover" width="300">
                ${product.discount > 0 ? `<p class="showcase-badge">${product.discount}%</p>` : ''}
                ${product.is_new ? `<p class="showcase-badge angle pink">new</p>` : ''}
                ${product.is_sale ? `<p class="showcase-badge angle black">sale</p>` : ''}
                <div class="showcase-actions">
                    <button class="btn-action" onclick="toggleWishlist(${product.id})"><ion-icon name="heart-outline"></ion-icon></button>
                    <button class="btn-action" onclick="quickView(${product.id})"><ion-icon name="eye-outline"></ion-icon></button>
                    <button class="btn-action" onclick="addToCart(${product.id}, 1)"><ion-icon name="bag-add-outline"></ion-icon></button>
                </div>
            </div>
            <div class="showcase-content">
                <a href="#" class="showcase-category">${product.category}</a>
                <h3><a href="#" class="showcase-title">${product.name}</a></h3>
                <div class="showcase-rating">${generateRatingStars(product.rating)}</div>
                <div class="price-box">
                    <p class="price">$${product.price.toFixed(2)}</p>
                    ${product.original_price > product.price ? `<del>$${product.original_price.toFixed(2)}</del>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to new buttons
    document.querySelectorAll('.product-grid .btn-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Generate rating stars
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<ion-icon name="star"></ion-icon>';
    if (hasHalfStar) stars += '<ion-icon name="star-half-outline"></ion-icon>';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) stars += '<ion-icon name="star-outline"></ion-icon>';
    return stars;
}

// Load new arrivals
function loadNewArrivals() {
    const newProducts = productsData.filter(p => p.is_new === 1).slice(0, 8);
    const containers = document.querySelectorAll('.product-minimal .showcase-wrapper');
    if (containers.length >= 1 && newProducts.length) {
        displayMinimalProducts(newProducts, containers[0]);
    }
}

// Load top rated
function loadTopRated() {
    const topProducts = [...productsData].sort((a, b) => b.rating - a.rating).slice(0, 8);
    const containers = document.querySelectorAll('.product-minimal .showcase-wrapper');
    if (containers.length >= 3 && topProducts.length) {
        displayMinimalProducts(topProducts, containers[2]);
    }
}

// Load deals
function loadDeals() {
    const dealProducts = productsData.filter(p => p.is_sale === 1 || p.discount > 0);
    const container = document.querySelector('.product-featured .showcase-wrapper');
    if (container && dealProducts.length) {
        displayFeaturedProduct(dealProducts[0], container);
    }
}

// Display minimal products
function displayMinimalProducts(products, container) {
    if (!container) return;
    container.innerHTML = products.map(product => `
        <div class="showcase-container">
            <div class="showcase">
                <a href="#" class="showcase-img-box" onclick="quickView(${product.id}); return false;">
                    <img src="${product.image}" alt="${product.name}" class="showcase-img" width="70">
                </a>
                <div class="showcase-content">
                    <a href="#" onclick="quickView(${product.id}); return false;">
                        <h4 class="showcase-title">${product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}</h4>
                    </a>
                    <a href="#" class="showcase-category" onclick="loadProducts('${product.category}'); return false;">${product.category}</a>
                    <div class="price-box">
                        <p class="price">$${product.price.toFixed(2)}</p>
                        ${product.original_price > product.price ? `<del>$${product.original_price.toFixed(2)}</del>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Display featured product
function displayFeaturedProduct(product, container) {
    if (!container) return;
    container.innerHTML = `
        <div class="showcase-container">
            <div class="showcase">
                <div class="showcase-banner"><img src="${product.image}" alt="${product.name}" class="showcase-img"></div>
                <div class="showcase-content">
                    <div class="showcase-rating">${generateRatingStars(product.rating)}</div>
                    <a href="#"><h3 class="showcase-title">${product.name}</h3></a>
                    <p class="showcase-desc">${product.description}</p>
                    <div class="price-box">
                        <p class="price">$${product.price.toFixed(2)}</p>
                        ${product.original_price > product.price ? `<del>$${product.original_price.toFixed(2)}</del>` : ''}
                    </div>
                    <button class="add-cart-btn" onclick="addToCart(${product.id}, 1)">add to cart</button>
                    <div class="showcase-status">
                        <div class="wrapper"><p>already sold: <b>${Math.floor(Math.random() * 50) + 10}</b></p><p>available: <b>${product.stock}</b></p></div>
                        <div class="showcase-status-bar"></div>
                    </div>
                    <div class="countdown-box">
                        <p class="countdown-desc">Hurry Up! Offer ends in:</p>
                        <div class="countdown">
                            <div class="countdown-content"><p class="display-number" id="days">00</p><p class="display-text">Days</p></div>
                            <div class="countdown-content"><p class="display-number" id="hours">00</p><p class="display-text">Hours</p></div>
                            <div class="countdown-content"><p class="display-number" id="mins">00</p><p class="display-text">Min</p></div>
                            <div class="countdown-content"><p class="display-number" id="secs">00</p><p class="display-text">Sec</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    startCountdown();
}

// Countdown timer
function startCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) {
            const ids = ['days', 'hours', 'mins', 'secs'];
            ids.forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '00'; });
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('mins');
        const secsEl = document.getElementById('secs');
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.textContent = mins.toString().padStart(2, '0');
        if (secsEl) secsEl.textContent = secs.toString().padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Add to cart
function addToCart(productId, quantity) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const existingItem = cartItems.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ id: Date.now(), product_id: productId, name: product.name, price: product.price, image: product.image, quantity: quantity });
    }
    saveCartToLocalStorage();
    updateCartCountDisplay();
    showNotification(product.name + ' added to cart!', 'success');
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) cartItems = JSON.parse(savedCart);
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Load wishlist from localStorage
function loadWishlistFromLocalStorage() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) wishlistItems = JSON.parse(savedWishlist);
}

// Save wishlist to localStorage
function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
}

// Update cart count
function updateCartCountDisplay() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.count').forEach(el => {
        const parent = el.closest('.action-btn');
        if (parent && parent.querySelector('ion-icon[name="bag-handle-outline"]')) {
            el.textContent = totalItems;
        }
    });
}

// Update wishlist count
function updateWishlistCountDisplay() {
    const totalItems = wishlistItems.length;
    document.querySelectorAll('.count').forEach(el => {
        const parent = el.closest('.action-btn');
        if (parent && parent.querySelector('ion-icon[name="heart-outline"]')) {
            el.textContent = totalItems;
        }
    });
}

// Toggle wishlist
function toggleWishlist(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const existingIndex = wishlistItems.findIndex(item => item.product_id === productId);
    if (existingIndex > -1) {
        wishlistItems.splice(existingIndex, 1);
        showNotification(product.name + ' removed from wishlist', 'info');
    } else {
        wishlistItems.push({ id: Date.now(), product_id: productId, name: product.name, price: product.price, image: product.image });
        showNotification(product.name + ' added to wishlist!', 'success');
    }
    saveWishlistToLocalStorage();
    updateWishlistCountDisplay();
}

// Setup search
function setupSearch() {
    const searchInput = document.querySelector('.search-field');
    const searchBtn = document.querySelector('.search-btn');
    const performSearch = function() { 
        if (searchInput && searchInput.value) {
            loadProducts('all', searchInput.value); 
        } else {
            loadProducts('all', '');
        }
    };
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) searchInput.addEventListener('keypress', function(e) { 
        if (e.key === 'Enter') performSearch(); 
    });
}

// Setup event listeners
function setupEventListeners() {
    document.querySelectorAll('.sidebar-submenu-title').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('.product-name')?.textContent.toLowerCase();
            if (category) loadProducts(category);
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryTitle = this.closest('.category-item')?.querySelector('.category-item-title')?.textContent;
            if (categoryTitle) loadProducts(categoryTitle.toLowerCase());
        });
    });
    
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.email-field');
            if (emailInput && emailInput.value) {
                showNotification('Subscribed successfully!', 'success');
                emailInput.value = '';
                const modalEl = document.querySelector('.modal');
                if (modalEl) modalEl.classList.add('closed');
            }
        });
    }
    
    document.querySelectorAll('.banner-btn, .cta-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productSection = document.querySelector('.product-main');
            if (productSection) productSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Desktop menu category links
    document.querySelectorAll('.desktop-menu-category-list .menu-category > .menu-title').forEach(link => {
        link.addEventListener('click', function(e) {
            const text = this.textContent.toLowerCase();
            if (text === 'men\'s') loadProducts('jacket');
            else if (text === 'women\'s') loadProducts('skirt');
            else if (text === 'jewelry') loadProducts('jewellery');
            else if (text === 'perfume') loadProducts('perfume');
            else if (text !== 'home' && text !== 'categories' && text !== 'blog' && text !== 'hot offers') {
                loadProducts(text);
            }
        });
    });
}

// Quick view
function quickView(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = `
        <div class="modal-close-overlay"></div>
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <button class="modal-close-btn" style="position: absolute; top: 15px; right: 15px; z-index: 10;"><ion-icon name="close-outline"></ion-icon></button>
            <div style="display: flex; flex-wrap: wrap; padding: 20px;">
                <div style="flex: 1; min-width: 200px;"><img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;"></div>
                <div style="flex: 1; padding: 20px;">
                    <h2>${product.name}</h2>
                    <div class="showcase-rating" style="margin: 10px 0;">${generateRatingStars(product.rating)}</div>
                    <p style="margin: 15px 0;">${product.description}</p>
                    <div class="price-box" style="margin: 15px 0;">
                        <p class="price" style="font-size: 24px;">$${product.price.toFixed(2)}</p>
                        ${product.original_price > product.price ? `<del>$${product.original_price.toFixed(2)}</del>` : ''}
                    </div>
                    <button class="btn-newsletter" onclick="addToCart(${product.id}, 1); document.querySelector('.modal').remove();" style="width: 100%;">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
    const closeBtn = modalDiv.querySelector('.modal-close-btn');
    const overlayEl = modalDiv.querySelector('.modal-close-overlay');
    const closeModal = function() { modalDiv.remove(); };
    closeBtn.addEventListener('click', closeModal);
    overlayEl.addEventListener('click', closeModal);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    let bgColor = '#4CAF50';
    if (type === 'error') bgColor = '#f44336';
    else if (type === 'info') bgColor = '#2196F3';
    notification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: ' + bgColor + '; color: white; padding: 15px 20px; border-radius: 8px; z-index: 10000; animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    notification.innerHTML = '<div><p style="color: white; margin: 0;">' + message + '</p></div>';
    document.body.appendChild(notification);
    setTimeout(function() { 
        notification.style.animation = 'slideOut 0.3s ease'; 
        setTimeout(function() { notification.remove(); }, 300); 
    }, 3000);
}

// Animation styles
if (!document.querySelector('#notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
    document.head.appendChild(styleSheet);
}

// Show cart modal
function showCartModal() {
    let cartHtml = '<div style="max-height: 400px; overflow-y: auto;">';
    let total = 0;
    if (cartItems && cartItems.length > 0) {
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const product = productsData.find(function(p) { return p.id === item.product_id; });
            if (product) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                cartHtml += '<div style="display: flex; gap: 15px; padding: 10px; border-bottom: 1px solid #eee; align-items: center;">' +
                    '<img src="' + product.image + '" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">' +
                    '<div style="flex: 1;">' +
                        '<h4 style="margin: 0 0 5px;">' + product.name + '</h4>' +
                        '<p style="margin: 0; color: #666;">$' + product.price.toFixed(2) + ' x ' + item.quantity + '</p>' +
                    '</div>' +
                    '<div>' +
                        '<p style="margin: 0; font-weight: bold;">$' + itemTotal.toFixed(2) + '</p>' +
                        '<button onclick="removeFromCart(' + item.id + ')" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 5px;">Remove</button>' +
                    '</div>' +
                '</div>';
            }
        }
        cartHtml += '</div><div style="padding: 15px; border-top: 2px solid #ddd;">' +
            '<p style="font-size: 18px; font-weight: bold;">Total: $' + total.toFixed(2) + '</p>' +
            '<button class="btn-newsletter" style="width: 100%; margin-top: 10px; background: #4CAF50;" onclick="proceedToCheckout()">Proceed to Checkout →</button>' +
        '</div>';
    } else {
        cartHtml += '<p style="text-align: center; padding: 40px;">Your cart is empty</p></div>';
    }
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = '<div class="modal-close-overlay"></div>' +
        '<div class="modal-content" style="max-width: 500px;">' +
            '<button class="modal-close-btn"><ion-icon name="close-outline"></ion-icon></button>' +
            '<div class="newsletter" style="padding: 30px;">' +
                '<h3 class="newsletter-title">Your Cart</h3>' +
                cartHtml +
            '</div>' +
        '</div>';
    document.body.appendChild(modalDiv);
    const closeBtn = modalDiv.querySelector('.modal-close-btn');
    const overlayEl = modalDiv.querySelector('.modal-close-overlay');
    const closeModal = function() { modalDiv.remove(); };
    closeBtn.addEventListener('click', closeModal);
    overlayEl.addEventListener('click', closeModal);
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    saveCartToLocalStorage();
    window.location.href = 'checkout.html';
}

// Remove from cart
function removeFromCart(cartId) {
    cartItems = cartItems.filter(function(item) { return item.id !== cartId; });
    saveCartToLocalStorage();
    updateCartCountDisplay();
    showNotification('Item removed from cart', 'info');
    const modalEl = document.querySelector('.modal');
    if (modalEl) modalEl.remove();
    showCartModal();
}

// Go to checkout from header
function goToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty! Add some products first.', 'error');
        return;
    }
    saveCartToLocalStorage();
    window.location.href = 'checkout.html';
}

// Make functions global
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.quickView = quickView;
window.loadProducts = loadProducts;
window.showCartModal = showCartModal;
window.proceedToCheckout = proceedToCheckout;
window.removeFromCart = removeFromCart;
window.goToCheckout = goToCheckout;