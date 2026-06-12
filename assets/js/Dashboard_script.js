 function scrollToProducts() {
      const productSection = document.querySelector('.product-main');
      if (productSection) productSection.scrollIntoView({ behavior: 'smooth' });
    }
    function showCartModal() {
      if (window.showCartModal) window.showCartModal();
      else alert('Cart modal - Add products to cart first');
    }