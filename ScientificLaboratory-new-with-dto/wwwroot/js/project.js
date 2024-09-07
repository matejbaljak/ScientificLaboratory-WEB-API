document.addEventListener('DOMContentLoaded', function () {
    const projectForm = document.getElementById('projectForm');
    const allProjectsDiv = document.getElementById('projects');
    const messageDiv = document.getElementById('message');
    const apiUrl = 'http://localhost:5108/api/Projects'; // Ensure this URL is correct

    // Fetch and display all projects
    function fetchProjects() {
        fetch(apiUrl)
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
                data.forEach(project => {
                    const researchers = project.projectResearchers && project.projectResearchers.$values
                        ? project.projectResearchers.$values.map(pr => pr.researcher.name).join(', ')
                        : 'None';

                    const projectDiv = document.createElement('div');
                    projectDiv.className = 'project-item';
                    projectDiv.innerHTML = `
                        <p class="project-item-title">Title: ${project.title}</p>
                        <p class="project-item-description">Description: ${project.description}</p>
                        <p><strong>Leader:</strong> ${project.projectLeader}</p>
                        <p><strong>Type:</strong> ${project.type}</p>
                        <p><strong>Start:</strong> ${project.startMonth}/${project.startYear}</p>
                        <p><strong>End:</strong> ${project.endMonth}/${project.endYear}</p>
                        <p><strong>Researchers:</strong> ${researchers}</p>
                        <button onclick="deleteProject(${project.id})">Delete</button>
                        <button onclick="loadProject(${project.id}, '${project.title}', '${project.description}', '${project.projectLeader}', '${project.startMonth}', '${project.startYear}', '${project.endMonth}', '${project.endYear}', '${project.type}', '${researchers}')">Load for Update</button>
                    `;
                    allProjectsDiv.appendChild(projectDiv);
                });
                console.log('Fetched projects:', data); // Log fetched projects
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

    // Validate form data before sending request
    function validateForm(data) {
        if (!data.title || !data.description || !data.projectLeader || !data.researchers.length) {
            alert('Please fill in all required fields.');
            return false;
        }
        return true;
    }

    // Handle form submission for creating or updating project
    projectForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const projectId = document.getElementById('projectId').value;
        const projectData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            startMonth: document.getElementById('startMonth').value,
            startYear: document.getElementById('startYear').value,
            endMonth: document.getElementById('endMonth').value,
            endYear: document.getElementById('endYear').value,
            type: document.getElementById('type').value,
            projectLeader: document.getElementById('projectLeader').value,
            researchers: document.getElementById('researchers').value.split(',').map(name => ({ name: name.trim(), institution: '' }))
        };

        if (!validateForm(projectData)) {
            return;
        }

        if (projectId) {
            updateProject(projectId, projectData);
        } else {
            createProject(projectData);
        }
    });

    // Function to create project
    function createProject(projectData) {
        fetch(`${apiUrl}/CreateWithResearchers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(err => {
                        throw new Error(Object.values(err.errors).flat().join(' '));
                    });
                }
            })
            .then(data => {
                fetchProjects(); // Refresh the projects list
                projectForm.reset();
                showMessage('Project created successfully!');
                console.log('Created project:', data); // Log created project
            })
            .catch(error => showMessage(`Error: ${error.message}`, true));
    }

    // Function to update project
    function updateProject(projectId, projectData) {
        fetch(`${apiUrl}/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return response.json().then(err => {
                        throw new Error(Object.values(err.errors).flat().join(' '));
                    });
                }
            })
            .then(data => {
                fetchProjects(); // Refresh the projects list
                projectForm.reset();
                showMessage('Project updated successfully!');
                console.log('Updated project:', projectId, projectData); // Log updated project
            })
            .catch(error => {
                console.error('Update project error:', error);
                showMessage(`Error: ${error.message}`, true);
            });
    }

    // Function to delete project
    window.deleteProject = function (projectId) {
        fetch(`${apiUrl}/${projectId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                fetchProjects(); // Refresh the projects list
                showMessage('Project deleted successfully!');
                console.log('Deleted project:', projectId); // Log deleted project
            })
            .catch(error => {
                console.error('Delete project error:', error);
                showMessage(`Error: ${error.message}`, true);
            });
    };

    // Function to load project data into the update form
    window.loadProject = function (id, title, description, projectLeader, startMonth, startYear, endMonth, endYear, type, researchers) {
        document.getElementById('projectId').value = id;
        document.getElementById('title').value = title;
        document.getElementById('description').value = description;
        document.getElementById('startMonth').value = startMonth;
        document.getElementById('startYear').value = startYear;
        document.getElementById('endMonth').value = endMonth;
        document.getElementById('endYear').value = endYear;
        document.getElementById('type').value = type;
        document.getElementById('projectLeader').value = projectLeader;
        document.getElementById('researchers').value = researchers;
        console.log('Loaded project for update:', { id, title, description, projectLeader, startMonth, startYear, endMonth, endYear, type, researchers }); // Log loaded project
    };
});
