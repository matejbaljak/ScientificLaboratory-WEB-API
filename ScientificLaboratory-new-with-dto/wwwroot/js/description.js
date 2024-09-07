document.addEventListener('DOMContentLoaded', function () {
    const selectedProjectId = localStorage.getItem('selectedProjectId');
    const selectedProjectTitle = localStorage.getItem('selectedProjectTitle');
    console.log('Retrieved Project ID:', selectedProjectId);
    console.log('Retrieved Project Title:', selectedProjectTitle);

    if (selectedProjectTitle) {
        const titleElement = document.getElementById('projectTitle');
        if (titleElement) {
            titleElement.textContent = selectedProjectTitle;
        } else {
            console.error('Title element not found');
        }
    }

    if (selectedProjectId) {
        fetchProjectDescriptionAndFunding(selectedProjectId);
    }
});

function fetchProjectDescriptionAndFunding(projectId) {
    fetch(`/api/Projects/${projectId}/description`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);
            displayProjectDescription(data.description);
            displayProjectFunding(data.funding);
            renderFundingPieChart(data.funding.fundingbyYears.$values); // Adjusted to access $values
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayProjectDescription(description) {
    const descriptionElement = document.getElementById('projectDescription');
    if (descriptionElement) {
        descriptionElement.textContent = description;
    } else {
        console.error('Description element not found');
    }
}

function displayProjectFunding(funding) {
    console.log('Funding data:', funding);
    const fundingDetailsElement = document.getElementById('fundingDetails');
    const fundingTableBody = document.getElementById('fundingTableBody');
    const totalAmountElement = document.getElementById('totalAmount');

    if (fundingDetailsElement && fundingTableBody && totalAmountElement) {
        if (funding && funding.fundingbyYears && Array.isArray(funding.fundingbyYears.$values)) {
            fundingDetailsElement.innerHTML = `
                <p><strong>Funder:</strong> ${funding.source}</p>
                <p><strong>Funding Program:</strong> ${funding.sponsorName}</p>
            `;

            fundingTableBody.innerHTML = funding.fundingbyYears.$values.map(year => `
                <tr>
                    <td>${year.year}</td>
                    <td>${year.amount} &euro;</td>
                </tr>
            `).join('');

            totalAmountElement.innerHTML = `<strong>Total Amount:</strong> ${funding.totalAmount} &euro;`;
        } else {
            console.error('FundingbyYears is not an array or is missing', funding.fundingbyYears);
            fundingDetailsElement.innerHTML = '<p>No funding information available.</p>';
        }
    } else {
        console.error('Funding details, table body, or total amount element not found');
    }
}

function renderFundingPieChart(fundingbyYears) {
    if (!fundingbyYears || !Array.isArray(fundingbyYears)) {
        console.error('Invalid funding by years data:', fundingbyYears);
        return;
    }

    console.log('Rendering pie chart with data:', fundingbyYears);

    const ctx = document.getElementById('fundingPieChart').getContext('2d');
    const data = {
        labels: fundingbyYears.map(year => year.year),
        datasets: [{
            label: 'Funding by Year',
            data: fundingbyYears.map(year => year.amount),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Funding by Year'
                },
                datalabels: {
                    formatter: (value, context) => {
                        let sum = 0;
                        const dataArr = context.chart.data.datasets[0].data;
                        dataArr.forEach(data => {
                            sum += data;
                        });
                        const percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#000', // Set color to black
                }
            }
        },
        plugins: [ChartDataLabels] // Add this line to enable the plugin
    };

    new Chart(ctx, config);
}
