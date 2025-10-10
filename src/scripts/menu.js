document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      // Toggle the 'expanded' class to show or hide the menu
      navLinks.classList.toggle('expanded');

      // Toggle the 'active' class for the hamburger icon
      hamburger.classList.toggle('active');

      // Update aria-expanded for accessibility
      const isExpanded = navLinks.classList.contains('expanded');
      hamburger.setAttribute('aria-expanded', isExpanded.toString());
    });

    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('expanded');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('expanded');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
});