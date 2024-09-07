document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicationId = urlParams.get('id'); // Get the publication ID from the URL

    if (!publicationId) {
        // If the ID is missing or invalid, display an error message
        document.body.innerHTML = `<p>Error: Missing or invalid publication ID.</p>`;
        return;
    }

    const publicationUrl = `http://localhost:5108/api/Publications/${publicationId}`;
    const pdfUrl = `http://localhost:5108/api/Publications/view-pdf/${publicationId}`;

    try {
        const response = await fetch(publicationUrl);

        if (!response.ok) {
            document.body.innerHTML = `<p>Error fetching publication: ${response.statusText}</p>`;
            return;
        }

        const publication = await response.json();

        // Display the publication details
        document.getElementById('publicationTitle').innerText = publication.title;
        document.getElementById('publicationAbstract').innerText = `Abstract: ${publication.abstract}`;
        document.getElementById('publicationYear').innerText = `Year: ${publication.year}`;
        document.getElementById('publicationPages').innerText = `Pages: ${publication.pages}`;
        document.getElementById('publicationISSN').innerText = `ISSN: ${publication.issn}`;
        document.getElementById('publicationDOI').innerText = `DOI: ${publication.doi}`;
        document.getElementById('publicationKeywords').innerText = `Keywords: ${publication.keywords.join(', ')}`;

        // Display the list of authors
        const authorsList = document.getElementById('authorsList');
        authorsList.innerHTML = ''; // Clear the loading text
        publication.authors.forEach(author => {
            const li = document.createElement('li');
            li.innerText = `${author.name} (${author.institution || 'No institution'})`;
            authorsList.appendChild(li);
        });

        // Set the link to view the PDF
        const pdfLink = document.getElementById('pdfLink');
        pdfLink.href = pdfUrl;

    } catch (error) {
        document.body.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});



