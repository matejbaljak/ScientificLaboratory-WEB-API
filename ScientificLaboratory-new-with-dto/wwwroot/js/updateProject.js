document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:5108/api/Projects'; // Ensure this URL is correct
    const membersApiUrl = 'http://localhost:5108/api/Members'; // API for fetching members
    const queryParams = new URLSearchParams(window.location.search);
    const projectId = queryParams.get('id'); // Get the project ID from the URL
    const projectForm = document.getElementById('projectForm');
    const messageDiv = document.getElementById('message');
    const projectLeaderSelect = document.getElementById('projectLeader');
    const researchersContainer = document.getElementById('researchersContainer');
    const fundingYearsContainer = document.getElementById('fundingYearsContainer');

    let membersList = []; // Store the members list for researchers and project leader

    // Check if the user is an admin
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
        alert('You do not have the necessary permissions to access this page.');
        window.location.href = 'login.html';
        return;
    }

    if (!projectId) {
        alert('No project ID provided in the URL.');
        return;
    }

    // Fetch the list of members for project leader and researcher dropdowns
    async function fetchMembersAndPopulate() {
        try {
            const response = await fetch(membersApiUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch members');

            const membersData = await response.json();
            membersList = membersData.$values; // Store the members data

            populateProjectLeaderDropdown(membersList);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }

    // Populate project leader dropdown
    function populateProjectLeaderDropdown(members) {
        projectLeaderSelect.innerHTML = ''; // Clear any existing options
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            projectLeaderSelect.appendChild(option);
        });
    }

    // Function to add a new researcher dropdown dynamically
    function populateResearchersDropdown() {
        const addResearcherButton = document.querySelector('.add-researcher-button');
        addResearcherButton.addEventListener('click', function () {
            const researcherRow = document.createElement('div');
            researcherRow.className = 'researcher-row';
            const selectElement = document.createElement('select');
            selectElement.className = 'researcherSelect';

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Select Researcher';
            selectElement.appendChild(emptyOption);

            // Populate researcher dropdown with members (use the stored membersList)
            membersList.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                selectElement.appendChild(option);
            });

            researcherRow.appendChild(selectElement);

            // Add delete button for the researcher row
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Remove';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function () {
                researchersContainer.removeChild(researcherRow);
            });
            researcherRow.appendChild(deleteButton);

            researchersContainer.appendChild(researcherRow);
        });
    }

    // Function to add a new funding year dynamically
    const addFundingButton = document.querySelector('.add-funding-button');
    addFundingButton.addEventListener('click', function () {
        const fundingYearRow = document.createElement('div');
        fundingYearRow.className = 'funding-year-row';

        // Input for year
        const yearInput = document.createElement('input');
        yearInput.type = 'number';
        yearInput.placeholder = 'Year';
        yearInput.className = 'fundingYear';
        fundingYearRow.appendChild(yearInput);

        // Input for amount
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.placeholder = 'Amount';
        amountInput.className = 'fundingAmount';
        amountInput.step = '0.01';
        fundingYearRow.appendChild(amountInput);

        // Add delete button for the funding year row
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Remove';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', function () {
            fundingYearsContainer.removeChild(fundingYearRow);
        });
        fundingYearRow.appendChild(deleteButton);

        fundingYearsContainer.appendChild(fundingYearRow);
    });

    // Fetch the existing project details to populate the form
    function fetchProjectDetails() {
        fetch(`${apiUrl}/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('title').value = data.title;
                document.getElementById('description').value = data.description;
                document.getElementById('startMonth').value = data.startMonth;
                document.getElementById('startYear').value = data.startYear;
                document.getElementById('endMonth').value = data.endMonth;
                document.getElementById('endYear').value = data.endYear;
                document.getElementById('type').value = data.type;
                projectLeaderSelect.value = data.projectLeader; // Set the project leader

                // Populate existing researchers
                data.projectResearchers.$values.forEach(researcher => {
                    const researcherRow = document.createElement('div');
                    researcherRow.className = 'researcher-row';

                    const selectElement = document.createElement('select');
                    selectElement.className = 'researcherSelect';

                    const emptyOption = document.createElement('option');
                    emptyOption.value = '';
                    emptyOption.textContent = 'Select Researcher';
                    selectElement.appendChild(emptyOption);

                    // Populate researcher dropdown with the members list
                    membersList.forEach(member => {
                        const option = document.createElement('option');
                        option.value = member.name;
                        option.textContent = member.name;
                        selectElement.appendChild(option);
                    });

                    selectElement.value = researcher.researcher.name; // Set the selected value

                    researcherRow.appendChild(selectElement);

                    // Add delete button for the researcher row
                    const deleteButton = document.createElement('button');
                    deleteButton.type = 'button';
                    deleteButton.textContent = 'Remove';
                    deleteButton.className = 'delete-button';
                    deleteButton.addEventListener('click', function () {
                        researchersContainer.removeChild(researcherRow);
                    });

                    researcherRow.appendChild(deleteButton);
                    researchersContainer.appendChild(researcherRow);
                });

                // Populate funding details
                if (data.funding) {
                    document.getElementById('fundingSource').value = data.funding.source || '';
                    document.getElementById('sponsorName').value = data.funding.sponsorName || '';

                    data.funding.fundingbyYears.$values.forEach(fundingYear => {
                        const fundingYearRow = document.createElement('div');
                        fundingYearRow.className = 'funding-year-row';
                        fundingYearRow.innerHTML = `
                        <input type="number" class="fundingYear" value="${fundingYear.year}" placeholder="Year">
                        <input type="number" class="fundingAmount" value="${fundingYear.amount}" placeholder="Amount">
                        <button type="button" class="delete-button" onclick="removeFundingYear(this)">Remove</button>
                    `;
                        fundingYearsContainer.appendChild(fundingYearRow);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching project details:', error);
                alert(`Failed to fetch project details: ${error.message}`);
            });
    }

    fetchProjectDetails();
    fetchMembersAndPopulate(); // Ensure members are loaded for the dropdowns
    populateResearchersDropdown(); // Populate researchers dropdown

    // Handle form submission for updating the project
    projectForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fundingByYears = Array.from(document.querySelectorAll('.funding-year-row')).map(row => {
            const year = row.querySelector('.fundingYear').value;
            const amount = row.querySelector('.fundingAmount').value;
            return { year: parseInt(year), amount: parseFloat(amount) };
        });

        const updatedProject = {
            id: projectId,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            startMonth: parseInt(document.getElementById('startMonth').value),
            startYear: parseInt(document.getElementById('startYear').value),
            endMonth: parseInt(document.getElementById('endMonth').value),
            endYear: parseInt(document.getElementById('endYear').value),
            type: document.getElementById('type').value,
            projectLeader: document.getElementById('projectLeader').value,
            researchers: Array.from(document.querySelectorAll('.researcherSelect')).map(select => ({
                name: select.value
            })),
            funding: {
                source: document.getElementById('fundingSource').value,
                sponsorName: document.getElementById('sponsorName').value,
                fundingbyYears: fundingByYears
            }
        };

        fetch(`${apiUrl}/${projectId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(`Error: ${response.status} ${text}`); });
                }
                return response.text().then(text => {
                    if (text) {
                        return JSON.parse(text); // Parse the JSON if there's content
                    } else {
                        return {}; // Return an empty object if there's no content
                    }
                });
            })
            .then(() => {
                alert('Project updated successfully');
                window.location.href = 'projectsUser.html';
            })
            .catch(error => {
                console.error('Error updating project:', error);
                alert(`An error occurred while updating the project: ${error.message}`);
            });
    });

    // Function to remove a funding year row
    window.removeFundingYear = function (button) {
        const row = button.parentElement;
        if (row && row.parentElement) {
            row.parentElement.removeChild(row);
        } else {
            console.error('Could not remove the funding year row: parent element not found.');
        }
    };
});
