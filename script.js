// Importing data and elements from data.js
import { BOOKS_PER_PAGE, authors, genres, books, html } from "./data.js";



// Creating a document fragment for efficient DOM manipulation
const fragment = document.createDocumentFragment();
const area = document.querySelector('[data-list-items]')
let index = 0


/**
 * Theme functionality:
 * Selecting elements for day/night theme
 */
const day = document.getElementById('Daydark'); 
const body = document.querySelector('body');

// Event listener for theme toggle button
Theme.addEventListener('click', function() {
  // Toggle between day and night themes
  if (this.classList.contains('day')) {
    // Switch to day theme
    this.classList.remove('Night');  
    this.classList.add('Day'); 
    body.style.background = 'White';
    body.style.color = 'Black';
    body.style.transition = '2s';
  } else {
    // Switch to night theme
    this.classList.remove('Day'); 
    this.classList.add('Night'); 
    body.style.background = 'Black';
    body.style.color = 'White';
    body.style.transition = '2s';
  }
}); 


/**
 * Preview element functionality:
 * Setting initial button text for loading books
 *
 * @type {Object}
 * @property {HTMLButtonElement} button - The button element for loading books.
 */
html.list.button.textContent = "Show More" + "(" + books.length + ")"


/**
 * Loads and displays books on the page.
 *
 * @param {Event} event - The click event triggering the book loading.
 * @returns {void}
 */
const loadBooks = (event) => {
    event.preventDefault();
    // Updating button text and extracting a slice of books
    html.list.message.classList = 'list__message'
    const extracted = books.slice(index, index + BOOKS_PER_PAGE);
    const booksLeft = books.length - index
    html.list.button.textContent = "Show More" + "(" + booksLeft + ")"

    // Looping through the extracted books and creating preview elements
    for (let i = index; i < index + BOOKS_PER_PAGE; i++) {
        const book = books[i]
        const image = book.image
        const title = book.title
        const authorId = book.author
        const id = book.id
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('id', id)
        element.innerHTML = /* html */ `
            <img class="preview__image"src="${image}"/>
            <div class="preview__info" data-box>
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div> `
        fragment.appendChild(element)   
    }

    // Appending the fragment to the DOM
    area.appendChild(fragment)
    index += extracted.length;

    // Disabling the button if all books are loaded
    if (index >= books.length) {
        html.list.button.disabled = true;
        html.list.button.classList.add('button--disabled');
    }
};

// Event listeners for loading books on page load and button click
html.list.button.addEventListener('click', loadBooks)
window.addEventListener('load', loadBooks);



// Event listener for displaying book details on button click
document.addEventListener('click', (event) => {
    // Check if the overlay is already open
    if (html.list.overlay.active.hasAttribute('open')) {
        // Close the overlay if it's already open
        html.list.overlay.active.removeAttribute('open')
    } else {
        // Checking if a preview button is clicked
        const button = event.target.closest('.preview')
        if (button == null) {
            return; //Exit if not a preview button
        }


        // Finding the corresponding book and displaying details
        const book = books.find(book => book.id === button.id);
        const year = new Date(book.published).getFullYear();
        console.log(year);

        // Update overlay with book details
        const title = html.list.overlay.title;
        title.innerText = book.title;
        const image = book.image;
        const imageElement = document.querySelector('[data-list-image]');
        imageElement.src = image;
        const blurElement = document.querySelector('[data-list-blur]');
        blurElement.src=image;
        const description = html.list.overlay.description;
        description.innerText = book.description;
        const subtitle = html.list.overlay.subtitle;
        subtitle.innerText = `${authors[book.author]} (` + `${year})`;
        // Open the overlay
        html.list.overlay.active.setAttribute('open', true);
    }
  });


 /**
 * Search functionality:
 * Function to handle search toggle
 *
 * @param {Event} event - The click event triggering the search toggle.
 * @returns {void}
 */
const handleSearchToggle = (event) => {
    event.preventDefault();

    // Destructure properties for clarity
    const { dialog } = html.search;

    // Toggling the search dialog's open attribute
    if (dialog.hasAttribute('open')) {
      dialog.removeAttribute('open');
  } else {
      dialog.setAttribute('open', true);
  }

// TODO: Add event listeners to searchable buttons (to be implemented)
const searchableButtons = document.querySelectorAll('[data-searchable]');

searchableButtons.forEach(button => {
  button.addEventListener('click', () => {
      // TODO: Implement logic when a searchable button is clicked
    });
  });
};

// Event listeners for search button and cancel button
html.search.button.addEventListener('click', handleSearchToggle)
html.search.cancel.addEventListener('click', handleSearchToggle)


/**
 * Settings functionality:
 * Function to handle settings toggle
 *
 * @param {Event} event - The click event triggering the settings toggle.
 * @returns {void}
 */
const handleSettingsToggle = (event) => {
    event.preventDefault();

    // Destructure properties for clarity
    const { dialog } = html.settings;

    // Toggling the settings dialog's open attribute
    if (dialog.hasAttribute('open')) {
        dialog.removeAttribute('open');
    } else {
        dialog.setAttribute('open', true);
    }

};

// Event listeners for settings button, cancel button, and save button
html.settings.button.addEventListener('click', handleSettingsToggle)
html.settings.cancel.addEventListener('click', handleSettingsToggle)


/**
 * Function to handle saving settings
 *
 * @param {Event} event - The click event triggering the settings save.
 * @returns {void}
 */
const handleSettingsSave = (event) => {
    event.preventDefault();
    // Logging the selected theme value
    console.log(html.settings.theme.value);

    // Setting CSS variables based on the selected theme
    if (html.settings.theme.value == 'night') {
        document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
        document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
        document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
        document.documentElement.style.setProperty("--color-light", "255, 255, 255");
    }

    // Closing the settings dialog
    html.settings.dialog.removeAttribute('open');
};

// Event listener for settings save button
html.settings.save.addEventListener('click', handleSettingsSave)


/**
 * Creating genre & author filter functionality:
 * Function to create genre options in the search dropdown
 *
 * @param {Event} event - The click event triggering the creation of genre options.
 * @returns {void}
 */
const createGenreOptionsHtml = (event) => {
    event.preventDefault();
    const fragment = document.createDocumentFragment();
    //const selectElement = document.getElementById("genre-select");
    document.getElementById("genre-select");

// Creating options for each genre and appending to the dropdown
genres.forEach((genre) => {
  const optionElement = document.createElement("option");
  optionElement.value = genre;
  optionElement.textContent = genre;
  selectElement.appendChild(optionElement);
});
}; 

// Event listener for creating genre options in the search dropdown
html.search.button.addEventListener('click', createGenreOptionsHtml);


/**
 * Function to create author options in the search dropdown
 *
 * @param {Event} event - The click event triggering the creation of author options.
 * @returns {void}
 */
const createAuthorOptionsHtml = (event) => {
    event.preventDefault();
    const fragment = document.createDocumentFragment();

    // Creating options for each author and appending to the dropdown
    for (const [key, value] of Object.entries(authors)) {
        const option = document.createElement('option')
        option.value = key;
        option.innerText = value;
        fragment.appendChild(option)
        
    }
    // Appending the fragment to the author dropdown
    html.search.author.appendChild(fragment);
   
};

// Event listener for creating author options in the search dropdown
html.search.author.addEventListener('click', createAuthorOptionsHtml)



/**
 * Search submission & result handling functionality:
 * Function to handle search submission and filtering books
 *
 * @param {Event} event - The click event triggering the search submission.
 * @returns {void}
 */
const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Creating a search object with title, author, and genre
    const search = {
      "title": html.search.title.value,
      "author": html.search.author.value,
      "genre": html.search.genre.value
    };
    // Filtering books based on search criteria
    const found = [];
    for (let x in search) {
      if (search[x] !== "") {
        found.push(...books.filter(book => book[x] === search[x]));
      }
    }

    // Displaying search results or message if no results found
    if (found.length > 0) {
      html.list.message.textContent = `${found.length} books found.`
      area.textContent = "";
      found.slice(0, BOOKS_PER_PAGE).forEach((book) => {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('id', book.id)
        element.innerHTML = /* html */ `
          <img class="preview__image"src="${book.image}"/>
          <div class="preview__info" data-box>
            <h3 class="preview__title">${book.title}</h3>
            <div class="preview__author">${authors[book.author]}</div>
          </div> `
        area.appendChild(element)
      })
    } else {
      html.list.message.textContent = `No results found.`
    }

    // Disabling the show more button
    html.list.button.disabled = true;
    html.list.button.classList.add('button--disabled');
  };
  
// Event listener for search submit button
html.search.submit.addEventListener('click', handleSearchSubmit)


/**
 * Function to handle search results display
 *
 * @param {Array} found - The array of books found in the search.
 * @returns {void}
 */
const handleSearchResults = (found) => {
    // Checking if results are undefined, hiding the search dialog
    if (typeof found === 'undefined') {
        html.search.dialog.removeAttribute('open')
        return;
    } else if (found.length === 0) {
        // If no results found, displaying a message
        area.innerHTML = ''
        html.list.message.classList = 'list__message_show'; 
    } else {
        // Displaying search results
        html.list.message.classList = 'list__message';
    area.innerHTML = '';
    for (let i = 0; i < found.length; i++) {
      const book = found[i];
      const image = book.image;
      const title = book.title;
      const authorId = book.author;
      const id = book.id;
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('id', id);
      element.innerHTML = /* html */ `
        <img class="preview__image" src="${image}"/>
        <div class="preview__info" data-box>
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[authorId]}</div>
        </div> `;
      fragment.appendChild(element);
    }

    area.appendChild(fragment);
  }

  // Hiding the search dialog
  html.search.dialog.removeAttribute('open');
};