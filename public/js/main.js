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

// Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

if (sidebarToggle && sidebar ) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    console.log("it toggle");
  });
}

// Close sidebar when clicking on a conversation (mobile only)
if (window.innerWidth <= 768) {
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('active');
  }
});