const authMessage = document.getElementById("auth-message");
const authButton = document.querySelector("button[data-auth-action]");

async function submitAuthForm() {
    authMessage.textContent = "";
    authButton.disabled = true;

    try {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const isRegister = authButton.dataset.authAction === "register";
        if (!document.getElementById("email").checkValidity() || !password) {
            throw new Error("Enter a valid email address and password.");
        }
        if (isRegister && password.length < 6) {
            throw new Error("Password must contain at least 6 characters.");
        }
        let response;

        if (isRegister) {
            const username = document.getElementById("username").value.trim();
            if (!username) throw new Error("Enter a username.");
            response = await window.sb.auth.signUp({
                email,
                password,
                options: { data: { username } }
            });
        } else {
            response = await window.sb.auth.signInWithPassword({ email, password });
        }

        if (response.error) throw response.error;
        if (isRegister && !response.data.session) {
            authMessage.textContent = "Check your email to confirm your account, then log in.";
            return;
        }
        window.location.href = "dashboard.html";
    } catch (error) {
        window.betVerse.showError(authMessage, error);
    } finally {
        authButton.disabled = false;
    }
}

authButton.addEventListener("click", submitAuthForm);
