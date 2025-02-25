document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        // Here you would typically make an API call to authenticate
        console.log('Logging in with:', { email, password });
        // Simulate successful login
        localStorage.setItem('user', JSON.stringify({ email }));
        window.location.href = '/dashboard.html'; // Changed from '/' to '/dashboard.html'
      } catch (error) {
        console.error('Login failed:', error);
        alert('Failed to log in. Please check your credentials.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      try {
        // Here you would typically make an API call to register
        console.log('Registering with:', { email, password, role });
        // Simulate successful registration
        localStorage.setItem('user', JSON.stringify({ email, role }));
        window.location.href = '/dashboard.html'; // Changed from '/' to '/dashboard.html'
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Failed to register. Please try again.');
      }
    });
  }

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  const navbarAuth = document.querySelector('.navbar-auth');
  
  if (user && navbarAuth) {
    navbarAuth.innerHTML = `
      <span class="nav-link">Welcome, ${user.email}</span>
      <button onclick="logout()" class="button">Logout</button>
    `;
  }
});

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/';
}