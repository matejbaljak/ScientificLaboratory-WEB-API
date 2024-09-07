document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const createNewsButton = document.getElementById("create-news-button");
    const newsModal = document.getElementById("news-modal");
    const closeModalButton = document.querySelector(".close");
    const newsForm = document.getElementById("news-form");
    const modalTitle = document.getElementById("modal-title");
    const submitButton = document.getElementById("submit-button");
    let isUpdate = false;

    // Function to check if the user is an admin
    function isAdmin() {
        const token2 = localStorage.getItem('token');
        if (!token2) {
            console.log('No token found');
            return false;
        }

        try {
            const payload = JSON.parse(atob(token2.split('.')[1]));
            console.log('Decoded JWT payload:', payload);
            const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            console.log('User role:', role);
            return role === 'Admin';
        } catch (e) {
            console.error('Error decoding JWT token:', e);
            return false;
        }
    }

    // Show admin buttons if the user is an admin
    if (isAdmin()) {
        console.log('Admin detected, showing admin buttons');
        createNewsButton.style.display = 'inline-block';
    } else {
        console.log('User is not an admin, hiding admin buttons');
    }

    // Open modal for creating new news
    createNewsButton.onclick = function () {
        const today = new Date().toISOString().split('T')[0];  // Get current date in YYYY-MM-DD format
        document.getElementById("publishedDate").value = today;  // Set the date field
        openModal('Create News', false);
    }

    // Close modal
    closeModalButton.onclick = function () {
        newsModal.style.display = "none";
    }

    // Handle form submission
    newsForm.onsubmit = function (e) {
        e.preventDefault();
        const newsId = document.getElementById("news-id").value;
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const publishedDate = document.getElementById("publishedDate").value;
        const url = document.getElementById("url").value;
        const content = document.getElementById("content").value;

        const newsData = { title, author, publishedDate, url, content };

        if (isUpdate) {
            handleUpdate(newsId, newsData);
        } else {
            handleCreate(newsData);
        }
    }

    // Open the modal and set the title
    function openModal(title, update, newsItem = {}) {
        newsModal.style.display = "block";
        modalTitle.textContent = title;
        isUpdate = update;

        const today = new Date().toISOString().split('T')[0];

        // If it's an update, populate the form with the existing data
        if (update) {
            document.getElementById("news-id").value = newsItem.id;
            document.getElementById("title").value = newsItem.title;
            document.getElementById("author").value = newsItem.author;
            document.getElementById("publishedDate").value = newsItem.publishedDate.split('T')[0];
            document.getElementById("url").value = newsItem.url;
            document.getElementById("content").value = newsItem.content;
            submitButton.textContent = 'Update';
        } else {
            // Clear form for new entry
            newsForm.reset();
            document.getElementById("publishedDate").value = today;  // Set today's date
            submitButton.textContent = 'Create';
        }
    }

    // Fetch the news from the API
    fetch('http://localhost:5108/api/News', {
        headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const newsItems = data["$values"] || [];
            console.log('Fetched news items:', newsItems);

            // Iterate through the news items and add them to the page
            newsItems.forEach(newsItem => {
                const newsElement = document.createElement('div');
                newsElement.className = 'news-item';
                newsElement.setAttribute('data-id', newsItem.id);  // Set data-id for each news item

                // Title Element
                const titleElement = document.createElement('h2');
                titleElement.className = 'news-title';
                titleElement.textContent = newsItem.title;

                // Meta Information (Author and Date)
                const metaElement = document.createElement('p');
                metaElement.className = 'news-meta';
                const authorElement = document.createElement('span');
                authorElement.className = 'news-author';
                authorElement.textContent = newsItem.author;
                const dateElement = document.createElement('span');
                dateElement.className = 'news-date';
                dateElement.textContent = ` | Published on: ${new Date(newsItem.publishedDate).toLocaleDateString()}`;

                metaElement.appendChild(authorElement);
                metaElement.appendChild(dateElement);

                // Image Element
                const imageElement = document.createElement('div');
                imageElement.className = 'news-image';
                const img = document.createElement('img');
                img.src = newsItem.url; // Assuming the URL is a direct link to the image
                img.alt = newsItem.title;
                img.onerror = () => { img.src = 'default-image.jpg'; }; // Fallback if the image fails to load
                imageElement.appendChild(img);

                // Content Element
                const contentElement = document.createElement('p');
                contentElement.className = 'news-content';
                contentElement.textContent = newsItem.content;

                // Admin controls (Update/Delete buttons) - Only append if user is an admin
                if (isAdmin()) {
                    const controlsElement = document.createElement('div');
                    controlsElement.className = 'news-controls';

                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.onclick = () => openModal('Update News', true, newsItem);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete';
                    deleteButton.onclick = () => handleDelete(newsItem.id);

                    controlsElement.appendChild(updateButton);
                    controlsElement.appendChild(deleteButton);
                    newsElement.appendChild(controlsElement);
                }

                // Append elements in the order: title -> meta -> image -> content -> (controls if admin)
                newsElement.appendChild(titleElement);
                newsElement.appendChild(metaElement);
                newsElement.appendChild(imageElement);
                newsElement.appendChild(contentElement);

                // Append the news item to the container
                newsContainer.appendChild(newsElement);
            });
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Failed to load news.</p>';
        });

    // Handle Create action
    function handleCreate(newsData) {
        fetch('http://localhost:5108/api/News', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newsData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create news item.');
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(newNewsItem => {
                newsModal.style.display = "none";
                location.reload();  // Reload the page to show the new item
            })
            .catch(error => {
                console.error('Error creating news:', error);
                alert('An error occurred while creating the news item.');
            });
    }

    // Handle Update action
    function handleUpdate(newsId, newsData) {
        fetch(`http://localhost:5108/api/News/${newsId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newsData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update news item.');
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(updatedNewsItem => {
                newsModal.style.display = "none";
                location.reload();  // Reload the page to show the updated item
            })
            .catch(error => {
                console.error('Error updating news:', error);
                alert('An error occurred while updating the news item.');
            });
    }

    // Handle Delete action
    function handleDelete(newsId) {
        if (confirm('Are you sure you want to delete this news item?')) {
            fetch(`http://localhost:5108/api/News/${newsId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Remove the news item from the DOM
                        const itemToRemove = document.querySelector(`.news-item[data-id="${newsId}"]`);
                        if (itemToRemove) {
                            itemToRemove.remove();
                        }
                    } else {
                        alert('Failed to delete the news item.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting news:', error);
                    alert('An error occurred while deleting the news item.');
                });
        }
    }
});
