document.addEventListener('DOMContentLoaded', function () {
    const createFundingForm = document.getElementById('createFundingForm');
    const updateFundingForm = document.getElementById('updateFundingForm');
    const fundingsList = document.getElementById('fundingsList');
    const messageDiv = document.getElementById('message');

    // Fetch and display all fundings
    function fetchFundings() {
        fetch('/api/fundings')
            .then(response => response.json())
            .then(data => {
                console.log('Fundings response:', data); // Debugging line
                const fundings = data.$values; // Extract the array from the response object
                if (!Array.isArray(fundings)) {
                    throw new Error('Fundings is not an array');
                }
                fundingsList.innerHTML = '';
                fundings.forEach(funding => {
                    console.log('Funding object:', funding); // Debugging line to inspect funding object
                    // Check if fundingbyYears is an array and if not, handle it accordingly
                    const fundingByYears = Array.isArray(funding.fundingbyYears) ? funding.fundingbyYears : funding.fundingbyYears.$values;
                    const fundingDiv = document.createElement('div');
                    fundingDiv.className = 'funding';
                    fundingDiv.innerHTML = `
                        <p><strong>Source:</strong> ${funding.source}</p>
                        <p><strong>Sponsor Name:</strong> ${funding.sponsorName}</p>
                        <p><strong>Funding By Years:</strong> ${fundingByYears.map(f => `${f.year}: $${f.amount}`).join(', ')}</p>
                        <button onclick="deleteFunding(${funding.fundingId})">Delete</button>
                        <button onclick="loadFunding(${funding.fundingId})">Load for Update</button>
                    `;
                    fundingsList.appendChild(fundingDiv);
                });
            })
            .catch(error => showMessage(`Error: ${error.message}`, true)); // Handle and log the error
    }

    fetchFundings();

    // Function to display messages
    function showMessage(message, isError = false) {
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 5000);
    }

    // Validate form data before sending request
    function validateForm(data) {
        if (!data.source || !data.sponsorName || !data.fundingbyYears.length) {
            alert('Please fill in all required fields.');
            return false;
        }
        if (data.fundingbyYears.some(f => isNaN(f.year) || isNaN(f.amount))) {
            alert('Please enter valid numbers for year and amount.');
            return false;
        }
        return true;
    }

    // Handle form submission for creating funding
    if (createFundingForm) {
        createFundingForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const fundingData = {
                source: document.getElementById('source').value,
                sponsorName: document.getElementById('sponsorName').value,
                fundingbyYears: document.getElementById('fundingYears').value.split(',').map(f => {
                    const [year, amount] = f.split(':');
                    return { year: parseInt(year.trim()), amount: parseFloat(amount.trim()) };
                })
            };

            if (!validateForm(fundingData)) {
                return;
            }

            fetch('/api/fundings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fundingData)
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
                    console.log('Create funding response:', data); // Log the response data
                    fetchFundings();
                    createFundingForm.reset();
                    showMessage('Funding created successfully!');
                })
                .catch(error => showMessage(`Error: ${error.message}`, true)); // Handle and log the error
        });
    }

    // Handle form submission for updating funding
    if (updateFundingForm) {
        updateFundingForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const id = document.getElementById('updateId').value;
            const fundingData = {
                source: document.getElementById('updateSource').value,
                sponsorName: document.getElementById('updateSponsorName').value,
                fundingbyYears: document.getElementById('updateFundingYears').value.split(',').map(f => {
                    const [year, amount] = f.split(':');
                    return { year: parseInt(year.trim()), amount: parseFloat(amount.trim()) };
                })
            };

            if (!validateForm(fundingData)) {
                return;
            }

            fetch(`/api/fundings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fundingData)
            })
                .then(response => {
                    if (response.ok) {
                        return response.text(); // Use response.text() instead of response.json()
                    } else {
                        return response.json().then(err => {
                            throw new Error(Object.values(err.errors).flat().join(' '));
                        });
                    }
                })
                .then(data => {
                    console.log('Update funding response:', data);
                    fetchFundings();
                    updateFundingForm.reset();
                    showMessage('Funding updated successfully!');
                })
                .catch(error => showMessage(`Error: ${error.message}`, true)); // Handle and log the error
        });
    }

    // Function to load funding data into the update form
    window.loadFunding = function (id) {
        fetch(`/api/fundings/${id}`)
            .then(response => response.json())
            .then(funding => {
                document.getElementById('updateId').value = funding.fundingId;
                document.getElementById('updateSource').value = funding.source;
                document.getElementById('updateSponsorName').value = funding.sponsorName;
                const fundingByYears = Array.isArray(funding.fundingbyYears) ? funding.fundingbyYears : funding.fundingbyYears.$values;
                document.getElementById('updateFundingYears').value = fundingByYears.map(f => `${f.year}: ${f.amount}`).join(', ');
            })
            .catch(error => showMessage(`Error: ${error.message}`, true)); // Handle and log the error
    };

    // Function to delete funding
    window.deleteFunding = function (id) {
        fetch(`/api/fundings/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    fetchFundings();
                    showMessage('Funding deleted successfully!');
                } else {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Failed to delete funding');
                    });
                }
            })
            .catch(error => showMessage(`Error: ${error.message}`, true)); // Handle and log the error
    };
});
