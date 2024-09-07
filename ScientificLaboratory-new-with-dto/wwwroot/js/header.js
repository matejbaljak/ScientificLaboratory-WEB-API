document.addEventListener('DOMContentLoaded', function () {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const navUl = document.querySelector('nav ul');

    dropdownMenu.addEventListener('click', function () {
        navUl.classList.toggle('show');
    });
});
