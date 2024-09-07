document.addEventListener('DOMContentLoaded', function () {
    const allProjectsDiv = document.getElementById('projects');
    const messageDiv = document.getElementById('message');
    const adminActionsDiv = document.getElementById('adminActions');
    const apiUrl = 'http://localhost:5108/api/Projects'; // Ensure this URL is correct
    let selectedProjectId = null;

    // Check if the user is an admin
    const isAdmin = localStorage.getItem('role') === 'Admin';

    // Fetch and display all projects
    function fetchProjects() {
        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.$values) {
                    data = data.$values; // Extract the actual array of projects
                } else if (!Array.isArray(data)) {
                    throw new Error('Expected an array but got ' + JSON.stringify(data));
                }
                allProjectsDiv.innerHTML = ''; // Clear existing projects

                // Add Create button for Admins above the table
                if (isAdmin) {
                    adminActionsDiv.innerHTML = `<button class="create-button" onclick="createProject()">Create New Project</button>`;
                }

                // Create a table
                const table = document.createElement('table');
                table.className = 'project-table';

                // Create table body
                const tbody = document.createElement('tbody');

                data.forEach(project => {
                    const researchers = project.projectResearchers && project.projectResearchers.$values
                        ? project.projectResearchers.$values.map(pr => pr.researcher.name).join(', ')
                        : 'None';

                    const row = document.createElement('tr');
                    row.innerHTML = `
        <td class="project-details">
            <p><strong>Title:</strong> ${project.title}</p>
            <p><strong>Project Type:</strong> ${project.type}</p>
            <p><strong>Project Leader:</strong> ${project.projectLeader}</p>
            <p><strong>Researchers:</strong> ${researchers}</p>
            <p><strong>Time Period:</strong> ${project.startMonth}/${project.startYear} - ${project.endMonth}/${project.endYear}</p>
        </td>
        <td class="button-cell">
            <button class="info-button" onclick="storeProjectIdAndShowDescription('${project.id}', '${encodeURIComponent(project.description)}', '${encodeURIComponent(project.title)}')">Additional Information</button>
            ${isAdmin ? `
            <button class="update-button" onclick="updateProject('${project.id}')">Update</button>
            <button class="delete-button" onclick="deleteProject('${project.id}')">Delete</button>
            ` : ''}
        </td>`;
                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
                allProjectsDiv.appendChild(table);


                console.log('Fetched projects:', data);
            })
            .catch(error => {
                console.error('Fetch projects error:', error);
                showMessage(`Error: ${error.message}`, true);
            });
    }

    fetchProjects();

    // Function to display messages
    function showMessage(message, isError = false) {
        if (!messageDiv) {
            console.error('Message div not found');
            return;
        }
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 5000);
    }

    // Function to store project ID and show project description
    window.storeProjectIdAndShowDescription = function (id, description, title) {
        selectedProjectId = id;
        const decodedTitle = decodeURIComponent(title);
        localStorage.setItem('selectedProjectId', selectedProjectId);
        localStorage.setItem('selectedProjectTitle', decodedTitle);
        console.log('Selected Project ID:', selectedProjectId);
        console.log('Selected Project Title (decoded):', decodedTitle);
        console.log('Stored Project Title in localStorage:', localStorage.getItem('selectedProjectTitle'));
        window.location.href = `description.html?description=${description}`;
    };

    // Function to update a project (only available for Admins)
    window.updateProject = function (id) {
        if (isAdmin) {
            window.location.href = `updateProject.html?id=${id}`;
        } else {
            alert('You do not have permission to update this project.');
        }
    };

    // Function to delete a project (only available for Admins)
    window.deleteProject = function (id) {
        if (isAdmin) {
            const confirmed = confirm('Are you sure you want to delete this project? This action cannot be undone.');
            if (confirmed) {
                fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete the project.');
                        }
                        showMessage('Project deleted successfully.', false);
                        // Reload the projects list after deletion
                        fetchProjects();
                    })
                    .catch(error => {
                        console.error('Delete project error:', error);
                        showMessage(`Error: ${error.message}`, true);
                    });
            }
        } else {
            alert('You do not have permission to delete this project.');
        }
    };

    // Function to create a new project (only available for Admins)
    window.createProject = function () {
        if (isAdmin) {
            window.location.href = 'createProject.html'; // Redirect to createProject.html
        } else {
            alert('You do not have permission to create a project.');
        }
    };

    // Search function
    function searchTable() {
        let filter, table, tr, td, i, txtValue;
        filter = input.value.toUpperCase();
        table = document.querySelector(".project-table");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0]; // Choose the column index as per requirement
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    // Attach search event listener
    var input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keyup', searchTable);
    } else {
        console.error('Search input element not found');
    }
});
