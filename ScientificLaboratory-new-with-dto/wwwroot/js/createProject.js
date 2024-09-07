document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed for create project page');

    const apiUrl = 'http://localhost:5108/api/Projects';
    const membersApiUrl = 'http://localhost:5108/api/Members'; // Members API URL
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found');
        alert('You are not logged in. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    // Function to populate both project leader and researchers dropdowns from members API
    async function fetchMembersAndPopulate() {
        try {
            const response = await fetch(membersApiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch members');

            const membersData = await response.json();
            populateResearchersDropdown(membersData.$values);
            populateProjectLeaderDropdown(membersData.$values);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }

    // Function to populate project leader table
    function populateProjectLeaderDropdown(members) {
        const addProjectLeaderButton = document.getElementById('addProjectLeaderButton');

        addProjectLeaderButton.addEventListener('click', function () {
            const projectLeaderTableBody = document.getElementById('projectLeaderTableBody');
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            // Dropdown for project leader name
            const selectElement = document.createElement('select');
            selectElement.className = 'projectLeaderSelect';

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Select Project Leader';
            selectElement.appendChild(emptyOption);

            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                selectElement.appendChild(option);
            });

            nameCell.appendChild(selectElement);

            // Delete button to remove the project leader row
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'deleteButton';
            deleteButton.addEventListener('click', function () {
                projectLeaderTableBody.removeChild(row);
            });
            actionsCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(actionsCell);

            projectLeaderTableBody.appendChild(row);
        });
    }

    // Function to populate researcher table
    function populateResearchersDropdown(members) {
        const addResearcherButton = document.getElementById('addResearcherButton');

        addResearcherButton.addEventListener('click', function () {
            const researchersTableBody = document.getElementById('researchersTableBody');
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            // Dropdown for researcher name
            const selectElement = document.createElement('select');
            selectElement.className = 'researcherSelectName';

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Select Researcher';
            selectElement.appendChild(emptyOption);

            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                selectElement.appendChild(option);
            });

            nameCell.appendChild(selectElement);

            // Delete button to remove the researcher row
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'deleteButton';
            deleteButton.addEventListener('click', function () {
                researchersTableBody.removeChild(row);
            });
            actionsCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(actionsCell);

            researchersTableBody.appendChild(row);
        });
    }

    // Function to add a row to the funding table
    function addFundingRow(year = '', amount = '') {
        const fundingTableBody = document.getElementById('fundingTableBody');
        const row = document.createElement('tr');

        const yearCell = document.createElement('td');
        const amountCell = document.createElement('td');
        const actionsCell = document.createElement('td');

        // Input for year
        const yearInput = document.createElement('input');
        yearInput.type = 'number';
        yearInput.value = year;
        yearInput.className = 'fundingYear';
        yearCell.appendChild(yearInput);

        // Input for amount
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.step = '0.01';
        amountInput.value = amount;
        amountInput.className = 'fundingAmount';
        amountCell.appendChild(amountInput);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.addEventListener('click', function () {
            fundingTableBody.removeChild(row);
        });
        actionsCell.appendChild(deleteButton);

        row.appendChild(yearCell);
        row.appendChild(amountCell);
        row.appendChild(actionsCell);

        fundingTableBody.appendChild(row);
    }

    // Handle adding a new funding row
    const addFundingButton = document.getElementById('addFundingButton');
    if (addFundingButton) {
        addFundingButton.addEventListener('click', function () {
            addFundingRow();
        });
    }

    fetchMembersAndPopulate();

    const form = document.getElementById('createProjectForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get project leader
        const projectLeaderSelect = document.querySelector('.projectLeaderSelect');
        const projectLeader = projectLeaderSelect ? projectLeaderSelect.value : '';

        // Collect researchers
        const researchers = Array.from(document.querySelectorAll('.researcherSelectName')).map(select => ({
            name: select.value,
            institution: null
        })).filter(researcher => researcher.name.trim() !== '');

        // Collect funding data
        const fundingYears = Array.from(document.getElementsByClassName('fundingYear')).map(input => parseInt(input.value));
        const fundingAmounts = Array.from(document.getElementsByClassName('fundingAmount')).map(input => parseFloat(input.value));

        const fundingbyYears = fundingYears.map((year, index) => ({
            year: year,
            amount: fundingAmounts[index]
        }));

        // Construct the new project object
        const newProject = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            projectLeader: projectLeader,
            startMonth: parseInt(document.getElementById('startMonth').value),
            startYear: parseInt(document.getElementById('startYear').value),
            endMonth: parseInt(document.getElementById('endMonth').value),
            endYear: parseInt(document.getElementById('endYear').value),
            type: document.getElementById('type').value,
            researchers: researchers,
            funding: {
                source: document.getElementById('fundingSource').value,
                sponsorName: document.getElementById('sponsorName').value,
                fundingbyYears: fundingbyYears
            }
        };

        // Submit the form
        console.log('Submitting new project data:', newProject);

        fetch(`${apiUrl}/CreateWithResearchers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newProject)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(Object.values(err.errors).flat().join(' '));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Project created successfully:', data);
                document.getElementById('result').innerText = 'Project created successfully!';
                document.getElementById('result').style.display = 'block';
                window.location.href = 'projectsUser.html';
            })
            .catch(error => {
                console.error('Error creating project:', error);
                alert(`Error: ${error.message}`);
            });
    });
});