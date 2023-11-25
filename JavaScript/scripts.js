//Import data
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Assign 'books' to 'matches' and initialize 'page' to 1
let matches = books;
let page = 1;

// Check if 'books' is defined and an array, throw an error if not
if (!books || !Array.isArray(books)) throw new Error('Source required');

//need to define range*******
const range = [];

// Check if 'range' is defined and has at least two elements, throw an error if not
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

// Define color values for day and night themes
const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
};

// Select the elements
const dataListImage = document.getElementById('data-list-image');

const dataListButton = document.getElementById('dataListButton');

// Function to create a preview element
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

// Function to append previews to the fragment
function appendPreviewsToFragment(fragment, books) {
    for (const book of books) {
        const preview = createPreviewElement(book);
        fragment.appendChild(preview);
    }
}

// Create a document fragment to hold DOM elements
const fragment = document.createDocumentFragment();

// Extract the first 36 books
const extracted = books.slice(0, 36);


// Loop through extracted books and create preview elements
for (const { author, image, title, id } of extracted) {
    const preview = createPreviewElement({
        author,
        id,
        image,
        title
    });

    // Append each preview to the fragment
    fragment.appendChild(preview);
}


// Append the fragment to the 'data-list-items' element
data-list-items.appendChild(fragment);

// Create document fragments for 'genres' and 'authors'
const genresFragment = document.createDocumentFragment();
const authorsFragment = document.createDocumentFragment();

// Create a default 'All Genres' option and append it to 'genresFragment'
let element = document.createElement('option');
element.value = 'any';
element.textContent = 'All Genres';
genresFragment.appendChild(element);

// Loop through entries of 'genres' and create option elements
for (const [id, name] of Object.entries(genres)) {
    element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    genresFragment.appendChild(element);
}

// Append 'genresFragment' fragment to 'data-search-genres'
data-search-genres.appendChild(genresFragment);

// Create a default 'All Authors' option and append it to 'authors'
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authorsFragment.appendChild(element);

// Loop through entries of 'authors' and create option elements
for (const [id, name] of Object.entries(authors)) {
    element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    authorsFragment.appendChild(element);
}

// Append 'authorsFragment' to 'data-search-authors'
data-search-authors.appendChild(authorsFragment);

// Determine the initial theme
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDarkMode ? 'night' : 'day';

// Set CSS variables based on the day or night theme
document.documentElement.style.setProperty('--color-dark', css[theme].dark);
document.documentElement.style.setProperty('--color-light', css[theme].light);


// Set the 'dataListButton' text
document.getElementById('dataListButton').disabled = !(Math.max(matches.length - page * BOOKS_PER_PAGE, 0) > 0);
document.getElementById('dataListButton').innerHTML = `<span>Show more</span><span class="list__remaining"> (${Math.max(matches.length - page * BOOKS_PER_PAGE, 0)})</span>`;


// Set the 'disabled' property based on the availability of more books
dataListButton.disabled = !(Math.max(matches.length - page * BOOKS_PER_PAGE, 0) > 0);

// Set the 'innerHTML' of 'dataListButton' with dynamic content
dataListButton.innerHTML = `<span>Show more</span><span class="list__remaining"> (${Math.max(matches.length - page * BOOKS_PER_PAGE, 0)})</span>`;

// Click event for canceling search overlay if it is open
data-search-cancel.addEventListener('click', () => { data-search-overlay.open = false; });

// Click event for canceling settings overlay if it is open
data-settings-cancel.addEventListener('click', () => { data-settings-overlay.open = false; });

// Submit event for settings form, invoking 'actions.settings.submit'
data-settings-form.addEventListener('submit', (event) => { actions.settings.submit(event); });


// Click event for closing the list if it is open
data-list-close.addEventListener('click', () => { data-list-active.open = false; });

// Click event for loading more books and updating the remaining count
dataListButton.addEventListener('click', () => {
    const previewsFragment = document.createDocumentFragment();
    appendPreviewsToFragment(previewsFragment, matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
    data-list-items.appendChild(previewsFragment);

    page += 1;
    updateListButton();
});

    // Set the 'dataListButton' text
    dataListButton.textContent = `Show more (${Math.max(matches.length - page * BOOKS_PER_PAGE, 0)})`;


    // Set the 'disabled' property based on the availability of more books
    dataListButton.disabled = !(Math.max(matches.length - page * BOOKS_PER_PAGE, 0) > 0);


    // Set the 'src' attribute of 'data-list-image'
    dataListImage.src = matches[0].image;

    // Set the 'innerHTML' of 'dataListButton' with dynamic content
    dataListButton.innerHTML = `<span>Show more</span><span class="list__remaining"> (${Math.max(matches.length - page * BOOKS_PER_PAGE, 0)})</span>`;

    // Function to update list button
function updateListButton() {
    const remaining = Math.max(matches.length - page * BOOKS_PER_PAGE, 0);
    dataListButton.disabled = remaining === 0;
    dataListButton.innerHTML = `<span>Show more</span><span class="list__remaining"> (${remaining})</span>`;
}

// Click event for opening the search overlay and focusing on the title input
data-header-search.addEventListener('click', () => {
    data-search-overlay.open = true;
    data-search-title.focus();
});

// Click event for search form, handling filtering and displaying results
data-search-form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    // Loop through booksList and filter based on title, author, and genre
    for (const book of matches) {
        const titleMatch = filters.title.trim() === '' && book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        let genreMatch = filters.genre === 'any';

        // Nested loop for handling genre filtering
        for (const genre of book.genres) {
            if (genre === filters.genre) {
                genreMatch = true;
                break;
            }
        }

        // Check if the book matches all filters and push to result array
        if (titleMatch && authorMatch && genreMatch) result.push(book);
    }

    // Display a message if no results are found
    if (result.length < 1) {
        data-list-message.classList.add('list__message_show');
    } else {
        data-list-message.classList.remove('list__message_show');
    }
    
    // Clear the list items and create a fragment for the extracted books
    data-list-items.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const extracted = matches.slice(range[0], range[1]);

    // Loop through extracted books and create button elements
    for (const { author, image, title, id } of extracted) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        // Set the inner HTML for each button
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

        // Append each button to the fragment
        fragment.appendChild(element);
    }
    
    // Append the fragment to 'data-list-items' and update button and scroll to top
    data-list-items.appendChild(fragment);
    const initial = matches.length - page * BOOKS_PER_PAGE;
    const remaining = Math.max(initial, 0);

    dataListButton.disabled = remaining === 0;

    dataListButton.innerHTML = `<span>Show more</span><span class="list__remaining"> (${remaining})</span>`;

    // Scroll to the top and close the search overlay
    window.scrollTo({ top: 0, behavior: 'smooth' });
    data-search-overlay.open = false;
});

// Submit event for settings overlay, updating the theme and closing the overlay
data-settings-overlay.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    data-settings-overlay.open = false;
});

// Click event for list items, opening a detailed view of the clicked book
data-list-items.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active;

    for (const node of pathArray) {
        if (active) break;
        const previewId = node?.dataset?.preview;

        for (const singleBook of books) {
            if (singleBook.id === previewId) active = singleBook;
        }
    }

    // If no active book is found, exit
    if (!active) return;
    // Open the detailed view, setting various properties
    data-list-active.open = true;
    data-list-image.src = active.image;
    data-list-title.textContent = active.title;
    data-list-subtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    data-list-description.textContent = active.description;
});