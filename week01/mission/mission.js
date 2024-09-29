// Select the dropdown element from the HTML
const themeSelector = document.querySelector('select[name="theme"]');

function changeTheme() {
    // Check to see what the current value of our select is.
    // The current value is conveniently found in themeSelector.value!
    
    // If the value is dark then:
    if (themeSelector.value === 'dark') {
        // Add the dark class to the body
        document.body.classList.add('dark');
        // Change the source of the logo img to point to the white logo
        document.querySelector('.logo').src = 'byui-logo_white.png';
    } else {
        // Otherwise
        // Remove the dark class
        document.body.classList.remove('dark');
        // Make sure the logo src is the blue logo
        document.querySelector('.logo').src = 'byui-logo_blue.webp';
    }
}

// Add an event listener to the themeSelector element here.
// Use the changeTheme function as the event handler function.
themeSelector.addEventListener('change', changeTheme);
