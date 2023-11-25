//Import data
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Create a document fragment
const fragment = document.createDocumentFragment();

// Define color values for day and night themes
const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
};

// Initialize page and matches
let page = 1; 
let matches = books;

// Validate 'range'
const range = [0, 36]; 

// Check if 'range' is defined and has at least two elements, throw an error if not
if (!range || range.length < 2) {
    throw new Error('Range must be an array with two numbers');
}

/**
 * Creates a preview element for a book.
 * @param {Object} book - The book object.
 * @returns {HTMLButtonElement} - The created preview element.
 */
function createPreviewElement({ author, id, image, title }) {
    const preview = document.createElement('button');
    preview.classList = 'preview';
    preview.setAttribute('data-preview', id);

    preview.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

    return preview;
}


/**
 * Appends book previews to a document fragment.
 * @param {DocumentFragment} fragment - The target fragment.
 * @param {Object[]} books - Array of books to create previews for.
 */
function appendPreviewsToFragment(fragment, books) {
    for (const book of books) {
        const preview = createPreviewElement(book);
        fragment.appendChild(preview);
    }
}

  // Event listener for 'Show more' button
dataListButton.addEventListener('click', () => {
    const previewsFragment = document.createDocumentFragment();
    const start = page * BOOKS_PER_PAGE;
    const end = (page + 1) * BOOKS_PER_PAGE;
    appendPreviewsToFragment(previewsFragment, matches.slice(start, end));
    dataListItems.appendChild(previewsFragment);
  
    page += 1;
    updateListButton();
  });

// Event listener for search form
dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = books.filter(book => {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        return titleMatch && authorMatch && genreMatch;
    });

    dataListMessage.classList.toggle('list__message_show', result.length < 1);
    dataListItems.innerHTML = '';
    const extracted = result.slice(range[0], range[1]);

    const fragment = document.createDocumentFragment();
    for (const { author, id, image, title } of extracted) {
        const element = createPreviewElement({ author, id, image, title });
        fragment.appendChild(element);
    }

    dataListItems.appendChild(fragment);
    const initial = Math.max(matches.length - page * BOOKS_PER_PAGE, 0);
    dataListButton.disabled = initial === 0;

    dataListButton.innerHTML = `<span>Show more</span><span class="list__remaining"> (${initial})</span>`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    dataSearchOverlay.open = false;
});


// Set the theme based on user preference
const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', theme === 'night' ? night.dark : day.dark);
document.documentElement.style.setProperty('--color-light', theme === 'night' ? night.light : day.light);

// Update the 'Show more' button on page load
updateListButton();


// Update the data-list-button
data-list-button.textContent == `Show more (${books.length - BOOKS_PER_PAGE})`; 
data-list-button.disabled ==!(matches.length - [page * BOOKS_PER_PAGE] > 0);

// Add event listener for data-list-button click
data-list-button.addEventListener('click', () => {
    const start = page * BOOKS_PER_PAGE;
    const end = (page + 1) * BOOKS_PER_PAGE;
    const previewsFragment = createPreviewsFragment(matches, start, end);
    
    // Append previews fragment and update remaining
    data-list-items.appendChild(previewsFragment);
    actions.list.updateRemaining();
    
    // Increment the page
    page += 1;
});

// Add event listener for data-header-search click
data-header-search.addEventListener('click', function() {
    data-search-overlay.open = true;
    data-search-title.focus();
});

// Add event listener for data-search-form click
data-search-form.addEventListener('click', (event) => {
    event.preventDefault();
    
    // Get form data and filter books
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of booksList) {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

        if (titleMatch && authorMatch && genreMatch) {
            result.push(book);
        }
    }

    // Show or hide list message
    if (result.length < 1) {
        data-list-message.classList.add('list__message_show');
    } else {
        data-list-message.classList.remove('list__message_show');
    }

    // Clear and update data-list-items
    data-list-items.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const extracted = result.slice(range[0], range[1]);

    for (const { author, image, title, id } of extracted) {
        const { author: authorId, id, image, title } = props;

        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        element.innerHTML = /* html */ `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div>
        `;

        fragment.appendChild(element);
    }

    // Append the fragment to data-list-items
    data-list-items.appendChild(fragment);
    
    // Update initial, remaining, and button state
    const initial = Math.max(matches.length - page * BOOKS_PER_PAGE, 0);
    const remaining = hasRemaining ? initial : 0;
    data-list-button.disabled = initial > 0;
    
    data-list-button.innerHTML = `<span>Show more</span><span class="list__remaining"> (${remaining})</span>`;

    // Scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close the search overlay
    data-search-overlay.open = false;
});

// Add event listener for data-settings-overlay submit
data-settings-overlay.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get form data and update color theme
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    
    // Close the settings overlay
    data-settings-overlay.open = false;
});

// Add event listener for data-list-items click
data-list-items.addEventListener('click', (event) => {
    // Handle the click on list items
    let active;

    // Traverse(move back and forth) the event path
    const pathArray = Array.from(event.path || event.composedPath());
    
    // Loop through the path
    for (const node of pathArray) {
        if (active) break;
        const previewId = node?.dataset?.preview;

        // Find the active book
        for (const singleBook of books) {
            if (singleBook.id === previewId) active = singleBook;
        }
    }

    // If no active book, return
    if (!active) return;
    
    // Open the data-list-active
    data-list-active.open = true;
    data-list-blur.src = active.image;
    data-list-title.innerText = active.title;
    data-list-subtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    data-list-description.innerText = active.description;
});
