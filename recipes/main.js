// Import the recipes data
import recipes from './recipes.mjs';

// Select the recipe section
const recipeSection = document.getElementById('recipe-section');

// Function to display a single recipe dynamically
function displaySingleRecipe(recipe) {
    const article = document.createElement('article');
    article.classList.add('recipe');

    // Create rating display with always 5 stars
    const fullStars = Math.floor(recipe.rating);
    const emptyStars = 5 - fullStars;

    const starsHTML = `${'⭐'.repeat(fullStars)}${'☆'.repeat(emptyStars)}`;

    // Wrap tags in <span> for styling
    const tagsHTML = recipe.tags
        .map(tag => `<span>${tag}</span>`)
        .join(', ');

    article.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <div class="description">${tagsHTML}</div>
        <h2>${recipe.name}</h2>
        <div class="rating" role="img" aria-label="Rating: ${recipe.rating} out of 5 stars">
            ${starsHTML}
        </div>
        <p>${recipe.description}</p>
    `;

    recipeSection.innerHTML = ''; // Clear previous content
    recipeSection.appendChild(article);
}

// Function to render multiple recipes
function renderRecipes(recipeList) {
    recipeSection.innerHTML = ''; // Clear previous content
    recipeList.forEach(recipe => displaySingleRecipe(recipe));
}

// Function to handle search and filter recipes
function filterRecipes(query) {
    const lowerQuery = query.toLowerCase();
    return recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

// Function to handle search input and display filtered recipes
function searchHandler(event) {
    event.preventDefault(); // Prevent form submission/reloading
    const searchInput = document.querySelector('.search-form input');
    const query = searchInput.value.trim();

    if (query) {
        const filteredRecipes = filterRecipes(query);
        renderRecipes(filteredRecipes.length ? filteredRecipes : [{ name: 'No Recipes Found', tags: [], rating: 0, description: 'No recipes match your search.', image: '' }]);
    } else {
        // If search is empty, show a random recipe
        displayRandomRecipe();
    }
}

// Function to display a random recipe
function displayRandomRecipe() {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    displaySingleRecipe(recipes[randomIndex]);
}

// Initialize the page with a random recipe
function init() {
    displayRandomRecipe();
    // Attach search functionality
    const searchButton = document.querySelector('.search-form button');
    searchButton.addEventListener('click', searchHandler);
}

// Initialize the application
init();
