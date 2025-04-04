import { 
    auth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    onAuthStateChanged, 
    signOut 
} from "../firebase.js";

// Login Function
export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "../index.html"; // Redirect to home
    } catch (error) {
        console.error("Login failed:", error.message);

        // Ensure the error message element exists
        const errorMessageElement = document.getElementById("error-message");
        if (errorMessageElement) {
            errorMessageElement.innerText = error.message;
        } else {
            alert("Error: " + error.message); // Fallback error display
        }
    }
}


// Sign Up Function
export async function registerUser(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        window.location.href = "login.html"; // Redirect to login
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Forgot Password Function
export async function resetPassword(email) {
    try {
        console.log("Sending reset email to:", email);
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent! Check your inbox.");
    } catch (error) {
        console.error("Password reset failed:", error.code, error.message);
        alert("Error: " + error.message);
    }
}

// Logout Function
export async function logoutUser() {
    try {
        await signOut(auth);
        alert("You have been logged out.");
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
}

// Authentication Status Check (Redirect if not logged in)
export function checkAuthStatus() {
    onAuthStateChanged(auth, (user) => {
        if (!user && !window.location.href.includes("login.html")) {
            window.location.href = "login.html"; // Redirect only if not already on login
        }
    });
}

// Show/Hide Logout Button Based on Auth Status
export function setupLogoutButton() {
    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            logoutBtn.classList.remove("hidden"); // Show logout button
            logoutBtn.addEventListener("click", async () => {
                await signOut(auth);
                window.location.href = "./auth/login.html"; // Redirect to login
            });
        } else {
            logoutBtn.classList.add("hidden"); // Hide logout button
        }
    });
}

// Prevent Logged-in Users from Accessing Login Page
export function preventLoggedInAccess() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "../index.html"; // Redirect logged-in users to home
        }
    });
}

// Ensure the login button works properly
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            loginUser(email, password);
        });
    }
});
