document.addEventListener('DOMContentLoaded', async () => {
    await fetchAndDisplayPublications();
});

// Function to fetch and display publications
async function fetchAndDisplayPublications() {
    const publicationsUrl = `http://localhost:5108/api/Publications`;

    try {
        const response = await fetch(publicationsUrl);

        if (!response.ok) {
            document.getElementById('publicationsList').innerHTML = `<p>Error fetching publications: ${response.statusText}</p>`;
            return;
        }

        const data = await response.json();
        const publications = data.$values;

        if (!Array.isArray(publications)) {
            console.error("Expected an array but got:", publications);
            document.getElementById('publicationsList').innerHTML = `<p>Error: The data retrieved is not an array.</p>`;
            return;
        }

        const publicationsList = document.getElementById('publicationsList');
        publicationsList.innerHTML = ''; // Clear the loading text

        publications.forEach(publication => {
            const publicationDiv = document.createElement('div');
            publicationDiv.classList.add('publication-item');

            publicationDiv.innerHTML = `
                <h3>${publication.title}</h3>
                <p>Title: <input type="text" id="title-${publication.id}" value="${publication.title}"></p>
                <p>Abstract: <input type="text" id="abstract-${publication.id}" value="${publication.abstract}"></p>
                <p>Year: <input type="number" id="year-${publication.id}" value="${publication.year}"></p>
                <p>Pages: <input type="text" id="pages-${publication.id}" value="${publication.pages}"></p>
                <p>ISSN: <input type="text" id="issn-${publication.id}" value="${publication.issn}"></p>
                <p>DOI: <input type="text" id="doi-${publication.id}" value="${publication.doi}"></p>
                <p>Keywords: <input type="text" id="keywords-${publication.id}" value="${publication.keywords.$values.join(', ')}"></p>
                <p>Authors: <input type="text" id="authorName-${publication.id}" value="${publication.authors.$values[0].name}">
                Institution: <input type="text" id="authorInstitution-${publication.id}" value="${publication.authors.$values[0].institution}"></p>
                <p>PDF: <input type="file" id="pdfFile-${publication.id}"></p>
            `;

            // Add link to view or download the current PDF, if available
            if (publication.id && publication.pdfFileName) {
                const pdfLink = document.createElement('a');
                pdfLink.href = `http://localhost:5108/api/Publications/view-pdf/${publication.id}`;
                pdfLink.innerText = `View PDF (${publication.pdfFileName})`;
                pdfLink.target = "_blank";
                publicationDiv.appendChild(pdfLink);
            } else {
                const noPdfText = document.createElement('p');
                noPdfText.innerText = 'No PDF available';
                publicationDiv.appendChild(noPdfText);
            }

            // Create and append the Update and Delete buttons
            const updateButton = document.createElement('button');
            updateButton.innerText = 'Update';
            updateButton.onclick = () => updatePublication(publication.id);
            publicationDiv.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => deletePublication(publication.id);
            publicationDiv.appendChild(deleteButton);

            publicationsList.appendChild(publicationDiv);
        });

    } catch (error) {
        document.getElementById('publicationsList').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Function to update publication details
async function updatePublication(id) {
    const title = document.getElementById(`title-${id}`).value;
    const abstract = document.getElementById(`abstract-${id}`).value;
    const year = document.getElementById(`year-${id}`).value;
    const pages = document.getElementById(`pages-${id}`).value;
    const issn = document.getElementById(`issn-${id}`).value;
    const doi = document.getElementById(`doi-${id}`).value;
    const keywords = document.getElementById(`keywords-${id}`).value.split(',');
    const authorName = document.getElementById(`authorName-${id}`).value;
    const authorInstitution = document.getElementById(`authorInstitution-${id}`).value;

    const publicationData = {
        title,
        abstract,
        year: parseInt(year, 10),
        pages,
        issn,
        doi,
        keywords,
        authors: [{
            name: authorName,
            institution: authorInstitution
        }]
    };

    try {
        const response = await fetch(`http://localhost:5108/api/Publications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publicationData)
        });

        if (response.ok) {
            await uploadPdf(id); // Call function to upload PDF after updating details
            alert('Publication updated successfully');
            location.reload(); // Optionally, reload the page or update the UI
        } else {
            alert('Failed to update publication');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Function to upload PDF file
async function uploadPdf(id) {
    const pdfFile = document.getElementById(`pdfFile-${id}`).files[0];

    if (pdfFile) {
        const formData = new FormData();
        formData.append('pdfFile', pdfFile);

        try {
            const response = await fetch(`http://localhost:5108/api/Publications/${id}/upload-pdf`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('PDF uploaded successfully');
            } else {
                alert('Failed to upload PDF');
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
}

// Function to delete a publication
async function deletePublication(id) {
    if (!confirm('Are you sure you want to delete this publication?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5108/api/Publications/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Publication deleted successfully');
            location.reload(); // Optionally, refresh the list of publications or redirect the user
        } else {
            alert('Failed to delete publication');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
