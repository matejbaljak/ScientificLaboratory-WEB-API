document.addEventListener('DOMContentLoaded', function () {
    fetchProjectIdsFromAPI()
        .then(projectIds => {
            if (projectIds.length > 0) {
                localStorage.setItem('projectIds', JSON.stringify(projectIds));
                console.log('Project IDs stored:', projectIds);
                fetchAndAggregateData(projectIds);
            } else {
                console.error('No project IDs found');
            }
        })
        .catch(error => {
            console.error('Error fetching project IDs:', error);
        });
});

async function fetchProjectIdsFromAPI() {
    try {
        const response = await fetch('http://localhost:5108/api/Fundings');
        const data = await response.json();

        const projectIds = data.$values.map(funding => funding.projectId);
        return projectIds.filter((id, index, self) => id && self.indexOf(id) === index);  // Remove duplicates and nulls

    } catch (error) {
        console.error('Failed to fetch project IDs:', error);
        return [];
    }
}

function fetchAndAggregateData(projectIds) {
    const fetchPromises = projectIds.map(projectId =>
        fetch(`/api/Projects/${projectId}/description`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
    );

    Promise.all(fetchPromises)
        .then(results => {
            const aggregatedData = aggregateFundingData(results);
            renderFundingBarChart(aggregatedData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function aggregateFundingData(projectsData) {
    const fundingByYear = {};

    projectsData.forEach(data => {
        const fundingYears = data.funding.fundingbyYears.$values;

        fundingYears.forEach(({ year, amount }) => {
            if (fundingByYear[year]) {
                fundingByYear[year] += amount;
            } else {
                fundingByYear[year] = amount;
            }
        });
    });

    return Object.entries(fundingByYear).map(([year, amount]) => ({
        year: parseInt(year),
        amount
    }));
}

function renderFundingBarChart(aggregatedData) {
    if (!aggregatedData || !Array.isArray(aggregatedData)) {
        console.error('Invalid aggregated data:', aggregatedData);
        return;
    }

    console.log('Rendering bar chart with aggregated data:', aggregatedData);

    const years = aggregatedData.map(item => item.year);
    const amounts = aggregatedData.map(item => item.amount);

    const ctx = document.getElementById('myChart').getContext('2d');
    const data = {
        labels: years,
        datasets: [{
            label: 'Total Income',
            data: amounts,
            backgroundColor: amounts.map((amount, index) =>
                index === amounts.length - 1 ? 'rgba(128, 128, 128, 0.7)' : 'rgba(54, 162, 235, 0.7)'),
            borderColor: amounts.map((amount, index) =>
                index === amounts.length - 1 ? 'rgba(128, 128, 128, 1)' : 'rgba(54, 162, 235, 1)'),
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) { return value / 1000 + 'k'; }
                    },
                    title: {
                        display: true,
                        text: 'Amount by Year [euro]'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Total incomes'
                },
            }
        }
    };

    new Chart(ctx, config);
}
