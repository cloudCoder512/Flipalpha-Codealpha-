function loadProfile() {
        const user = JSON.parse(localStorage.getItem('user'));
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        if (user) {
            document.getElementById('displayName').innerText = user.name || 'User';
            document.getElementById('displayEmail').innerText = user.email || '';
            document.getElementById('avatarLetter').innerText = (user.name || 'U').charAt(0).toUpperCase();
            document.getElementById('fullName').value = profile.fullName || user.name || '';
            document.getElementById('emailAddress').value = profile.email || user.email || '';
            document.getElementById('phoneNumber').value = profile.phone || '';
            document.getElementById('dob').value = profile.dob || '';
            document.getElementById('address').value = profile.address || '';
            document.getElementById('memberSince').innerText = 'Member since: ' + (profile.joined || '2024');
        }
        
        const userOrders = orders.filter(o => o.user_id === (user?.id));
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);
        
        document.getElementById('totalOrders').innerText = userOrders.length;
        document.getElementById('totalSpent').innerText = '$' + totalSpent.toFixed(2);
        document.getElementById('wishlistCount').innerText = wishlist.length;
    }
    
    function saveProfile() {
        const profile = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('emailAddress').value,
            phone: document.getElementById('phoneNumber').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            joined: new Date().getFullYear()
        };
        localStorage.setItem('profile', JSON.stringify(profile));
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.name = profile.fullName;
            user.email = profile.email;
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        alert('Profile saved successfully!');
        loadProfile();
    }
    
    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
        window.location.href = '../index.html';
    }
    loadProfile();