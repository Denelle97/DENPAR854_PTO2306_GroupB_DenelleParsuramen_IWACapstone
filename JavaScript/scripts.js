//Import data
import { BOOKS_PER_PAGE, 
    authors, 
    genres, 
    books } from "./data.js";

// Assign 'books' to 'matches' and initialize 'page' to 1
matches = books;
page = 1;

// Check if 'books' is defined and an array, throw an error if not
if (!books || !Array.isArray(books)) throw new Error('Source required');

// Check if 'range' is defined and has at least two elements, throw an error if not
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

// Define color values for day and night themes
day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};

night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
};

// Create a document fragment to hold DOM elements
fragment = document.createDocumentFragment();

// Extract the first 36 books
const extracted = books.slice(0, 36);


// Loop through extracted books and create preview elements
for ({ author, image, title, id } of extracted) {
    const preview = createPreview({
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
genres = document.createDocumentFragment();
authors = document.createDocumentFragment();

// Create a default 'All Genres' option and append it to 'genres'
element = document.createElement('option');
element.value = 'any';
element = 'All Genres';
genres.appendChild(element);

// Loop through entries of 'genres' and create option elements
for ([id, name] of Object.entries(genres)) {
    element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    genres.appendChild(element);
}

// Append 'genres' fragment to 'data-search-genres'
data-search-genres.appendChild(genres);

// Create a default 'All Authors' option and append it to 'authors'
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authors.appendChild(element);

// Loop through entries of 'authors' and create option elements
for ([id, name] of Object.entries(authors)) {
    element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    authors.appendChild(element);
}

// Append 'authors' fragment to 'data-search-authors'
data-search-authors.appendChild(authors);

// Determine the initial theme
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDarkMode ? 'night' : 'day';

// Set CSS variables based on the day or night theme
document.documentElement.style.setProperty('--color-dark', css[theme].dark);
document.documentElement.style.setProperty('--color-light', css[theme].light);

// Set the 'data-list-button' text
data-list-button.textContent = `Show more (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})`;

// Set the 'disabled' property based on the availability of more books
data-list-button.disabled = !(matches.length - page * BOOKS_PER_PAGE > 0);

// Set the 'innerHTML' of 'data-list-button' with dynamic content
data-list-button.innerHTML = `<span>Show more</span><span class="list__remaining"> (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})</span>`;

// Click event for canceling search overlay if it is open
data-search-cancel.addEventListener('click', () => { data-search-overlay.open === false });

// Click event for canceling settings overlay if it is open
data-settings-cancel.addEventListener('click', () => { querySelect(data-settings-overlay).open === false });

// Submit event for settings form, invoking 'actions.settings.submit'
data-settings-form.addEventListener('submit', (event) => { actions.settings.submit });

// Click event for closing the list if it is open
data-list-close.addEventListener('click', () => { data-list-active.open === false });

// Click event for loading more books and updating the remaining count
data-list-button.addEventListener('click', () => {
    document.querySelector(data-list-items).appendChild(createPreviewsFragment(matches, page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
    actions.list.updateRemaining();
    page += 1;
});

// Click event for opening the search overlay and focusing on the title input
data-header-search.addEventListener('click', () => {
    data-search-overlay.open === true;
    data-search-title.focus();
});

// Click event for search form, handling filtering and displaying results
data-search-form.addEventListener('click', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    // Loop through booksList and filter based on title, author, and genre
    for (const book of booksList) {
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
    if (result.length < 1) 
        data-list-message.classList.add('list__message_show');
    else 
        data-list-message.classList.remove('list__message_show');
    
    
    // Clear the list items and create a fragment for the extracted books
    data-list-items.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const extracted = source.slice(range[0], range[1]);

    // Loop through extracted books and create button elements
    for ({ author, image, title, id } of extracted) {
        const { author: authorId, id, image, title } = props;

        
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        // Set the inner HTML for each button
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div>
        `;

        // Append each button to the fragment
        fragment.appendChild(element);
    }
    
    // Append the fragment to 'data-list-items' and update button and scroll to top
    data-list-items.appendChild(fragment);
    const initial = matches.length - page * BOOKS_PER_PAGE;
    const remaining = initial > 0 ? initial : 0;
    data-list-button.disabled = initial > 0;

    // Set the 'innerHTML' of 'data-list-button' with dynamic content
    data-list-button.innerHTML = `<span>Show more</span>
    <span class="list__remaining"> (${remaining})</span>`;

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
    data-settings-overlay.open === false;
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
    data-list-active.open === true;
    data-list-blur + data-list-image === active.image;
    data-list-title === active.title;
    
    data-list-subtitle === `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    data-list-description === active.description;
});
