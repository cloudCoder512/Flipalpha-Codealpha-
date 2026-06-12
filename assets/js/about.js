 document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            alert('Thank you ' + name + '! Your message has been sent successfully. We will respond within 24 hours.');
            this.reset();
        } else {
            alert('Please fill all required fields.');
        }
    });