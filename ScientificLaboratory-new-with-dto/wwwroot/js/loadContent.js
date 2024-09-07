document.addEventListener("DOMContentLoaded", function () {
    // Load the header
    loadContent("header", "../header.html", function () {
        setupStickyHeader();
        highlightActiveLink(); // Highlight the active link after loading the header
        setupDropdownMenu(); // Setup dropdown menu functionality
    });

    // Load the footer
    loadContent("footer", "../footer.html");
});

function loadContent(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) {
                callback(); // Call the callback function after the content is loaded
            }
        })
        .catch(error => {
            console.error('Error fetching content:', error);
        });
}

function setupStickyHeader() {
    var header = document.getElementById("sticky-header");
    if (!header) return; // Ensure header exists before setting up the scroll event
    var sticky = header.offsetTop;

    window.onscroll = function () { makeHeaderSticky(header, sticky) };
}

function makeHeaderSticky(header, sticky) {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

function highlightActiveLink() {
    var currentPath = window.location.pathname;
    currentPath = currentPath.substring(currentPath.lastIndexOf('/') + 1); // Extract the file name from the path

    var navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(function (link) {
        var linkPath = link.getAttribute("href");
        linkPath = linkPath.substring(linkPath.lastIndexOf('/') + 1); // Extract the file name from the link

        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
}

function setupDropdownMenu() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const navList = document.getElementById('nav-list');

    dropdownMenu.addEventListener('click', function () {
        navList.classList.toggle('show'); // Toggle the visibility of the navigation list
    });
}
