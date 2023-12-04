# DENPAR854_PTO2306_GroupB_DenelleParsuramen_IWACapstone

#link to slide show#
https://docs.google.com/presentation/d/1hViTJmifTqEOAaQn5keMLx9BnlSs1xqd3P6JPIXFjv0/edit#slide=id.p

#Book Connect App Instructions#
Welcome to the Book Connect App! This application allows you to explore and discover new books based on your preferences. Here's a guide to help you make the most of the app's features:

#Viewing Book Previews#
1.Book List:
-The main screen displays a list of book previews, showing the title, author, and cover image.

2.Loading More Books:
-Click the "Show More" button to load additional book previews.

3.Preview Details:
-Click on a book preview to view details, including a summary, publication date, and additional information.

#Searching for Books#
1.Search Bar:
-Utilize the search bar to find books based on specific text phrases. Enter keywords related to the title, author, or genre.

2.Filter by Author:
-Use the author dropdown menu to filter books by your favorite authors.

3.Filter by Genre:
-Explore books by filtering them based on different genres using the genre dropdown menu.

#Reading Preferences#
1.Dark/Light Mode:
-Toggle between dark and light modes using the theme button to enhance your reading experience, especially during nighttime.

#Additional Tips#
1.Book Details:
-Click on a book preview to reveal additional details such as a summary, publication date, and more.

2.Settings:
-Access the settings menu by clicking the magnifying glass icon or the user Icon. Here, you can customize your experience, including theme selection.

3.Responsive Design:
-The app is designed to work seamlessly on various devices, so feel free to explore on your computer, tablet, or mobile phone.

4.Enjoy Exploring:
-Discover new books, find your favorite authors, and enjoy the world of literature through this user-friendly app.


Below was submitted with first submission. 

The original code had several issues and did not align with the initial challenge brief and user expectations. 

1.Undefined Elements:

In the original code, there were references to elements like dataListButton, dataSearchForm, dataListItems, etc., without any indication of where these elements were coming from. These elements need to be obtained from the HTML document.

2.Syntax Errors:

The original code contained syntax errors, such as using == for comparison instead of === and incorrectly using == in the data-list-button.textContent and data-list-button.disabled assignments.
I corrected these syntax errors by using the appropriate comparison operators.

3.Incorrect Event Listener:

In the event listener for the 'Show more' button (dataListButton), there was no indication of where createPreviewsFragment and actions.list.updateRemaining functions came from.
I replaced the undefined functions with the appropriate logic (appendPreviewsToFragment and updateListButton).

4.Undefined Variables:

The original code referenced variables like dataSearchOverlay, dataSearchForm, dataListButton, etc., without defining them.
I made changes referencing them where defined.

5.Logical Error in Event Listener:

In the event listener for data-header-search, the condition data-search-overlay.open !== true; was likely a logical error. The correct syntax for opening the search overlay would be data-search-overlay.open = true;.
I corrected this logical error to open the search overlay.

6.Undefined CSS Object:

The code referenced a css object without any indication of where it came from.
I made changes referencing them where defined(Stylesheet).

7.Inconsistent Event Listener Usage:

There were inconsistencies in event listener usage, such as using === for some comparisons and !== for others.
I maintained consistency in the event listener conditions by using ===.

In summary, the original code had various issues related to undefined elements, syntax errors, logical errors, and inconsistent usage. My changes focused on defining elements, correcting syntax, replacing undefined functions, and addressing logical errors, bringing the code closer to meeting the initial challenge brief and user expectations.

