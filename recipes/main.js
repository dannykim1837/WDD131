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

// Display a random recipe
const randomIndex = Math.floor(Math.random() * recipes.length);
displaySingleRecipe(recipes[randomIndex]);
