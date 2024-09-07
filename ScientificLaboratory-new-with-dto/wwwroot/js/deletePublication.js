document.addEventListener('DOMContentLoaded', function () {
    const allPublicationsDiv = document.getElementById('publications');
    const apiUrl = 'http://localhost:5108/api/Publications'; // Ensure this URL is correct
    const role = localStorage.getItem('role');

    // Fetch and display all publications
    function fetchPublications() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.$values) {
                    data = data.$values; // Extract the actual array of publications
                }
                allPublicationsDiv.innerHTML = ''; // Clear existing publications

                // Create a table
                const table = document.createElement('table');
                table.className = 'publication-table';

                // Create table body
                const tbody = document.createElement('tbody');

                data.forEach(publication => {
                    const authors = publication.authors && publication.authors.$values
                        ? publication.authors.$values.map(author => author.name).join(', ')
                        : 'Unknown';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="publication-details">
                            <p><strong>Title:</strong> ${publication.title}</p>
                            <p><strong>Year:</strong> ${publication.year}</p>
                            <p><strong>Authors:</strong> ${authors}</p>
                            <p><strong>Type:</strong> ${publication.type || 'Journal'}</p>
                        </td>`;

                    // If user is an admin, add Update and Delete buttons to the right of the table
                    if (role === 'Admin') {
                        const adminButtonCell = document.createElement('td');
                        adminButtonCell.className = 'admin-button-cell';
                        adminButtonCell.innerHTML = `
                            <button class="updateButton" data-publication-id="${publication.id}">Update</button>
                            <button class="deleteButton" data-publication-id="${publication.id}">Delete</button>
                        `;
                        row.appendChild(adminButtonCell);
                    }

                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
                allPublicationsDiv.appendChild(table);

                console.log('Fetched publications:', data);

                // Attach click event listeners to the delete buttons
                document.querySelectorAll('.deleteButton').forEach(button => {
                    button.addEventListener('click', function () {
                        const publicationId = this.getAttribute('data-publication-id');
                        if (confirm('Are you sure you want to delete this publication?')) {
                            deletePublication(publicationId);
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Fetch publications error:', error);
                alert(`Error: ${error.message}`);
            });
    }

    function deletePublication(publicationId) {
        fetch(`${apiUrl}/${publicationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Publication deleted successfully.');
                    fetchPublications(); // Refresh the list after deletion
                } else {
                    alert('Failed to delete the publication.');
                }
            })
            .catch(error => {
                console.error('Delete publication error:', error);
                alert('Error: ' + error.message);
            });
    }

    fetchPublications(); // Initial fetch to display all publications
});
