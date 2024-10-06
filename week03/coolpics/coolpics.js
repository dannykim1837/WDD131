document.getElementById('menu-btn').addEventListener('click', function() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks.style.display === 'none' || navLinks.style.display === '') {
        navLinks.style.display = 'block';
    } else {
        navLinks.style.display = 'none';
    }
});
