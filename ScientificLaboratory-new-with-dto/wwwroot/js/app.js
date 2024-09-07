document.addEventListener('DOMContentLoaded', function () {
    const allNewsDiv = document.getElementById('allnews');
    const messageDiv = document.getElementById('message');

    // Fetch and display all news
    function fetchNews() {
        fetch('/api/News')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Full response:', data);
                if (data.$values && Array.isArray(data.$values)) {
                    data = data.$values;
                } else {
                    console.error('Expected an array but got:', data);
                    throw new Error('News is not an array');
                }
                allNewsDiv.innerHTML = ''; // Clear existing news
                data.forEach(news => {
                    const newsDiv = document.createElement('div');
                    newsDiv.className = 'news-item';
                    newsDiv.innerHTML = `
                        <p class="news-item-title">Title: ${news.title}</p>
                        <p class="news-item-content">Content: ${news.content}</p>
                        <p><strong>Author:</strong> ${news.author}</p>
                        <p><strong>Published Date:</strong> ${new Date(news.publishedDate).toLocaleDateString()}</p>
                    `;
                    allNewsDiv.appendChild(newsDiv);
                });
            })
            .catch(error => {
                console.error('Fetch news error:', error);
                showMessage(`Error: ${error.message}`, true);
            });
    }

    function showMessage(message, isError = false) {
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 5000);
    }

    fetchNews();
});
