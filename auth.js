// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const passwordToggles = document.querySelectorAll('.password-toggle');

// Toggle password visibility
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Login form handling
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const remember = loginForm.remember.checked;

        try {
            // Here you would typically make an API call to your backend
            const response = await mockLoginAPI(email, password);
            
            if (response.success) {
                // Store the token in localStorage or sessionStorage based on "remember me"
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem('token', response.token);
                storage.setItem('user', JSON.stringify(response.user));

                // Redirect to dashboard or home page
                window.location.href = 'index.html';
            } else {
                showError('Invalid email or password');
            }
        } catch (error) {
            showError('An error occurred. Please try again later.');
        }
    });
}

// Signup form handling
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullname = signupForm.fullname.value;
        const email = signupForm.email.value;
        const phone = signupForm.phone.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm['confirm-password'].value;

        // Basic validation
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            const response = await mockSignupAPI({
                fullname,
                email,
                phone,
                password
            });

            if (response.success) {
                // Store the token
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Redirect to dashboard or home page
                window.location.href = 'index.html';
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError('An error occurred. Please try again later.');
        }
    });
}

// Mock API functions (replace these with actual API calls)
async function mockLoginAPI(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (email === 'test@example.com' && password === 'password') {
        return {
            success: true,
            token: 'mock-jwt-token',
            user: {
                id: 1,
                name: 'Test User',
                email: email
            }
        };
    }
    return { success: false };
}

async function mockSignupAPI(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
        success: true,
        token: 'mock-jwt-token',
        user: {
            id: 1,
            name: userData.fullname,
            email: userData.email
        }
    };
}

// Helper functions
function showError(message) {
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ff4444;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1rem;
        text-align: center;
    `;
    errorDiv.textContent = message;

    // Insert error message at the top of the form
    const form = document.querySelector('.auth-form');
    form.insertBefore(errorDiv, form.firstChild);

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        // User is logged in
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Update UI based on auth status
function updateUIForAuth() {
    const isLoggedIn = checkAuth();
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Call updateUIForAuth when the page loads
document.addEventListener('DOMContentLoaded', updateUIForAuth);
