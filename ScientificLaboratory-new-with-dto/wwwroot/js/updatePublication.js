document.addEventListener('DOMContentLoaded', async function () {
    const apiUrl = 'http://localhost:5108/api/Publications'; // API for Publications
    const membersApiUrl = 'http://localhost:5108/api/Members'; // API for fetching members
    const publicationId = localStorage.getItem('selectedPublicationId');
    const token = localStorage.getItem('token'); // Retrieve the JWT token

    let membersList = [];

    // Fetch members for the author dropdowns
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
            membersList = membersData.$values || []; // Store the members data for dropdowns
            populateAuthorDropdowns(); // Populate the author dropdowns once members are fetched
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }

    // Function to populate author dropdowns dynamically
    function populateAuthorDropdowns(selectedAuthors = []) {
        const authorsContainer = document.getElementById('authorsContainer');
        authorsContainer.innerHTML = ''; // Clear existing author fields

        const label = document.createElement('p');
        label.textContent = 'Authors:';
        label.style.fontWeight = 'bold';
        authorsContainer.appendChild(label);

        // If existing authors are provided, add them first
        if (selectedAuthors.length > 0) {
            selectedAuthors.forEach(author => {
                addAuthorDropdown(author.name); // Add each existing author
            });
        } else {
            addAuthorDropdown(); // Otherwise, add one empty author dropdown
        }
    }

    // Function to add a new author dropdown dynamically
    function addAuthorDropdown(selectedValue = '') {
        const authorRow = document.createElement('div');
        authorRow.className = 'author-row';

        const selectElement = document.createElement('select');
        selectElement.className = 'authorSelect';

        // Empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Select Author';
        selectElement.appendChild(emptyOption);

        // Populate the dropdown with the members list
        membersList.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            selectElement.appendChild(option);
        });

        // Set the selected author if provided
        if (selectedValue) {
            selectElement.value = selectedValue;
        }

        authorRow.appendChild(selectElement);

        // Add a delete button for the author row
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Remove';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', function () {
            authorRow.remove();
        });
        authorRow.appendChild(deleteButton);

        document.getElementById('authorsContainer').appendChild(authorRow);
    }

    // Function to add a new keyword field
    function addKeywordField(value = '') {
        const keywordContainer = document.createElement('div');
        keywordContainer.className = 'keyword-row';

        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.name = 'keywords[]';
        keywordInput.classList.add('keyword');
        keywordInput.value = value;
        keywordInput.placeholder = 'Enter keyword';

        const deleteKeywordBtn = document.createElement('button');
        deleteKeywordBtn.type = 'button';
        deleteKeywordBtn.innerText = 'Remove';
        deleteKeywordBtn.classList.add('delete-btn');

        deleteKeywordBtn.addEventListener('click', function () {
            keywordContainer.remove();
        });

        keywordContainer.appendChild(keywordInput);
        keywordContainer.appendChild(deleteKeywordBtn);
        document.getElementById('keywordsContainer').appendChild(keywordContainer);
    }

    // Fetch the existing publication details to populate the form
    async function fetchPublicationDetails() {
        try {
            const response = await fetch(`${apiUrl}/${publicationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch publication details');
            }

            const data = await response.json();

            document.getElementById('title').value = data.title || '';
            document.getElementById('abstract').value = data.abstract || '';
            document.getElementById('year').value = data.year || '';
            document.getElementById('type').value = data.type || '';
            document.getElementById('pages').value = data.pages || '';
            document.getElementById('issn').value = data.issn || '';
            document.getElementById('doi').value = data.doi || '';

            // Populate existing authors as dropdowns
            populateAuthorDropdowns(data.authors.$values || []);

            // Populate existing keywords without quotes and parentheses
            const keywordsContainer = document.getElementById('keywordsContainer');
            keywordsContainer.innerHTML = ''; // Clear existing keywords
            if (data.keywords && data.keywords.$values && data.keywords.$values.length > 0) {
                data.keywords.$values.forEach(keyword => {
                    addKeywordField(keyword); // Populate without quotes or parentheses
                });
            } else {
                addKeywordField(); // Add an empty keyword field
            }

            // Fetch and display the current PDF filename if it exists
            const pdfResponse = await fetch(`${apiUrl}/view-pdf/${publicationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (pdfResponse.ok) {
                const contentDisposition = pdfResponse.headers.get('Content-Disposition');
                const matches = contentDisposition && contentDisposition.match(/filename\*?=['"]?([^'"]+)/);
                if (matches && matches[1]) {
                    const pdfFilename = decodeURIComponent(matches[1]);
                    const pdfUrl = `${apiUrl}/view-pdf/${publicationId}`;
                    const pdfLabel = document.createElement('p');
                    pdfLabel.innerHTML = `Current PDF: <a href="${pdfUrl}" target="_blank">${pdfFilename}</a>`;
                    document.getElementById('pdfFile').insertAdjacentElement('beforebegin', pdfLabel);
                }
            }

        } catch (error) {
            console.error('Error fetching publication details:', error);
            document.getElementById('result').innerText = `Failed to load publication data: ${error.message}`;
        }
    }

    fetchPublicationDetails(); // Ensure publication data is loaded
    fetchMembersAndPopulate(); // Ensure members are loaded for author dropdowns

    // Handle adding new authors dynamically
    document.getElementById('addAuthor').addEventListener('click', function () {
        addAuthorDropdown(); // Add a new empty author dropdown
    });

    // Handle adding new keywords dynamically
    document.getElementById('addKeyword').addEventListener('click', function () {
        addKeywordField(); // Add a new empty keyword field
    });

    // Handle form submission for updating the publication
    document.getElementById('publicationForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const updatedPublication = {
            title: document.getElementById('title').value,
            abstract: document.getElementById('abstract').value,
            year: parseInt(document.getElementById('year').value),
            type: document.getElementById('type').value,
            pages: document.getElementById('pages').value,
            issn: document.getElementById('issn').value,
            doi: document.getElementById('doi').value,
            authors: Array.from(document.querySelectorAll('.authorSelect')).map(select => ({
                name: select.value
            })),
            keywords: Array.from(document.querySelectorAll('.keyword')).map(input => input.value)
        };

        try {
            const response = await fetch(`${apiUrl}/${publicationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPublication)
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Error updating publication: ${errorDetails}`);
            }

            document.getElementById('result').innerText = 'Publication updated successfully!';

            // Handle PDF update if a new file is uploaded
            const pdfFileInput = document.getElementById('pdfFile');
            if (pdfFileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('pdfFile', pdfFileInput.files[0]);

                const pdfResponse = await fetch(`${apiUrl}/${publicationId}/upload-pdf`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!pdfResponse.ok) {
                    const pdfErrorDetails = await pdfResponse.text();
                    throw new Error(`Error updating PDF: ${pdfErrorDetails}`);
                }

                document.getElementById('result').innerText += '\nPDF updated successfully!';
            }

        } catch (error) {
            document.getElementById('result').innerText = `Error: ${error.message}`;
        }
    });
});
