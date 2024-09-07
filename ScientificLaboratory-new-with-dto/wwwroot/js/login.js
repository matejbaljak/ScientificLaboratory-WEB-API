document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');

    // If the user is already logged in and is an Admin, hide login form and show logout button
    if (token && role === 'Admin') {
        loginForm.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        logoutButton.style.display = 'none';
    }

    // Handle the login form submission
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login response:', data);

                const tokenObject = data.token;
                const token = tokenObject.result;

                if (!token) {
                    throw new Error('Token not found in the response');
                }

                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT Payload:', payload);

                const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                console.log('Extracted Role:', role);

                localStorage.setItem('token', token);
                localStorage.setItem('role', role);

                if (role === 'Admin') {
                    loginForm.style.display = 'none';
                    logoutButton.style.display = 'block';
                } else {
                    alert('You do not have the required permissions to access this resource.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                }
            } else {
                const errorData = await response.json();
                document.getElementById('error-message').textContent = errorData.message || 'Invalid username or password!';
            }
        } catch (error) {
            document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
            console.error('Login error:', error);
        }
    });

    // Handle the logout button click
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        loginForm.style.display = 'block';
        logoutButton.style.display = 'none';
    });
});
