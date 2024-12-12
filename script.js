function validateLogin() {
    const userid = document.getElementById('userid').value;
    const password = document.getElementById('password').value;

    // Check for correct credentials
    if (userid === 'Mohit' && password === 'Mohit199') {
        // Redirect to another HTML page (e.g., welcome.html)
        window.location.href = 'home.html'; // Make sure to create this file
        return false; // Prevent form submission
    } else {
        alert('Invalid User ID or Password');
        return false; // Prevent form submission
    }
}