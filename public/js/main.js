// Toggle mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', function() {
    console.log('Menu button clicked');
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
  });
}

// Global animation function for elements with data-animate attribute
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  animatedElements.forEach(el => {
    el.classList.add('animate');
  });
});
