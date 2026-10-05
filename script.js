// script.js
document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('header-placeholder');
  
  if (headerPlaceholder) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;

        // Attach burger toggle logic after injection
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
            menuToggle.setAttribute('aria-expanded', isOpen);
          });
        }
      })
      .catch(err => console.error('Error loading header:', err));
  }
});