document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicationId = urlParams.get('id');

    console.log("Publication ID:", publicationId);

    if (!publicationId || publicationId === 'null') {
        console.error('Invalid publication ID');
        document.getElementById('publicationDetails').innerHTML = '<p>Invalid publication ID.</p>';
        return;
    }

    await fetchAndDisplayPublicationDetails(publicationId);
});

async function fetchAndDisplayPublicationDetails(id) {
    const publicationUrl = `http://localhost:5108/api/Publications/${id}`;

    try {
        const response = await fetch(publicationUrl);

        if (!response.ok) {
            console.error("Error fetching publication details:", response.statusText);
            document.getElementById('publicationDetails').innerHTML = '<p>Error loading publication details.</p>';
            return;
        }

        const publication = await response.json();
        console.log("Fetched Publication:", publication);

        const detailsDiv = document.getElementById('publicationDetails');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <h2>Publication Details</h2>
                <h3>${publication.title}</h3>
                <div id="abstract">
                    <p><strong>Abstract:</strong> ${publication.abstract}</p>
                </div>
                <div id="detailsWrapper">
                    <div class="left">
                        <p class="section-title">Publication Info</p>
                        <p><strong>ISSN:</strong> ${publication.issn}</p>
                        <p><strong>DOI:</strong> ${publication.doi}</p>
                        <p><strong>Pages:</strong> ${publication.pages}</p>
                    </div>
                    <div class="right">
                        <p class="section-title">PDF Document</p>
                        ${publication.pdfBase64 ? `<a href="${getPdfUrl(publication.pdfBase64)}" target="_blank">View PDF</a>` : '<p>No PDF available</p>'}
                    </div>
                </div>
                <div id="keywords">
                    <p><strong>Keywords:</strong> ${getKeywords(publication)}</p>
                </div>
            `;
        } else {
            console.error("Element with ID 'publicationDetails' not found.");
        }

    } catch (error) {
        console.error("Error:", error.message);
        document.getElementById('publicationDetails').innerHTML = '<p>Error loading publication details.</p>';
    }
}

function getPdfUrl(base64) {
    const pdfBlob = base64ToBlob(base64, 'application/pdf');
    return URL.createObjectURL(pdfBlob);
}

function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

function getKeywords(publication) {
    if (publication.keywords && publication.keywords.$values && publication.keywords.$values.length > 0) {
        return publication.keywords.$values.map(keyword => keyword.trim()).join(', ');
    } else {
        return 'None';
    }
}
