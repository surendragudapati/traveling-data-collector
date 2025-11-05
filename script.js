// Background images array - famous places in India
const backgroundImageUrls = [
    'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // India Gate
    'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // Taj Mahal
    'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // Red Fort
    'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // Charminar
    'https://images.pexels.com/photos/1319429/pexels-photo-1319429.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // Golden Temple
    'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // Hawa Mahal
    'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center', // Mysore Palace
    'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600&fit=crop&crop=center'  // Lotus Temple
];

let backgroundImages = [];
let currentImageIndex = 0;

// ----------------- Custom Alert -----------------
function showCustomAlert(message, title = "Notice") {
    alert(`${title}\n\n${message}`);
}

// ----------------- User account management -----------------
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// Check if user exists
function userExists(email) {
    return registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Add new user
function addUser(userData) {
    registeredUsers.push(userData);
    saveUsers();
}

// Validate login credentials
function validateLogin(email, password) {
    return registeredUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );
}

// ----------------- Background Carousel -----------------
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.background-carousel');
    if (!carousel) return;
    
    backgroundImageUrls.forEach((url, index) => {
        const img = document.createElement('div');
        img.className = 'background-image';
        img.style.backgroundImage = `url(${url})`;
        if (index === 0) img.classList.add('active');
        carousel.appendChild(img);
        backgroundImages.push(img);
    });
    
    setInterval(rotateBackgroundImages, 3000);
    initializeFormSwitching();
});

function rotateBackgroundImages() {
    if (backgroundImages.length === 0) return;
    
    backgroundImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    backgroundImages[currentImageIndex].classList.add('active');
}

// ----------------- Form Switching -----------------
function initializeFormSwitching() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchText = document.getElementById('switchText');
    
    function switchToLogin() {
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        switchText.innerHTML = 'Don\'t have an account? <button id="switchBtn" type="button">Sign up now</button>';
        document.getElementById('switchBtn').addEventListener('click', switchToSignup);
    }
    
    function switchToSignup() {
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        switchText.innerHTML = 'Already have an account? <button id="switchBtn" type="button">Sign in</button>';
        document.getElementById('switchBtn').addEventListener('click', switchToLogin);
    }
    
    if (loginBtn) loginBtn.addEventListener('click', switchToLogin);
    if (signupBtn) signupBtn.addEventListener('click', switchToSignup);
    const initialSwitchBtn = document.getElementById('switchBtn');
    if (initialSwitchBtn) initialSwitchBtn.addEventListener('click', switchToSignup);

    // ----------------- Form submission handlers -----------------
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!userExists(email)) {
                showCustomAlert('Account not found! Please create an account first.', 'Login Error');
                switchToSignup();
                return;
            }
            
            const user = validateLogin(email, password);
            if (!user) {
                showCustomAlert('Invalid password! Please try again.', 'Login Error');
                return;
            }
            
            console.log('Login successful for:', user.firstName + ' ' + user.lastName);
            
            const submitBtn = loginForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showCustomAlert(`Welcome back, ${user.firstName}! Redirecting to main page...`, 'Login Successful');
                window.location.href = 'mainpage.html';  // ✅ redirect to mainpage.html
            }, 1500);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('signupEmail').value,
                password: document.getElementById('signupPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                phone: document.getElementById('phone').value,
                country: document.getElementById('country').value
            };
            
            if (formData.password !== formData.confirmPassword) {
                showCustomAlert('Passwords do not match!', 'Signup Error');
                return;
            }
            
            if (userExists(formData.email)) {
                showCustomAlert('Account already exists! Please login instead.', 'Signup Error');
                switchToLogin();
                document.getElementById('loginEmail').value = formData.email;
                return;
            }
            
            const newUser = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                country: formData.country,
                registeredAt: new Date().toISOString()
            };
            
            addUser(newUser);
            console.log('Signup attempt:', formData);
            
            const submitBtn = signupForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showCustomAlert(`Account created successfully! Welcome ${formData.firstName}! Redirecting...`, 'Signup Successful');
                window.location.href = 'mainpage.html';  // ✅ redirect to mainpage.html
            }, 2000);
        });
    }
}

// ----------------- Password toggle -----------------
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ----------------- Validation helpers -----------------
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
}

document.getElementById('signupEmail').addEventListener('blur', function() {
    this.style.borderColor = validateEmail(this.value) ? 'rgba(255, 255, 255, 0.2)' : '#ef4444';
});

document.getElementById('phone').addEventListener('blur', function() {
    this.style.borderColor = validatePhone(this.value) ? 'rgba(255, 255, 255, 0.2)' : '#ef4444';
});

document.getElementById('signupPassword').addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    console.log('Password strength:', strength);
});
