const profileMessage = document.getElementById("profile-message");

async function loadProfile() {
    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;
        const profile = await window.betVerse.getProfile(user.id);
        document.getElementById("username").textContent = profile.username || "—";
        document.getElementById("email").textContent = profile.email || user.email || "—";
        document.getElementById("balance").textContent = Number(profile.balance).toFixed(2);
    } catch (error) {
        window.betVerse.showError(profileMessage, error);
    }
}

async function logout() {
    const { error } = await window.sb.auth.signOut();
    if (error) {
        window.betVerse.showError(profileMessage, error);
        return;
    }
    window.location.href = "login.html";
}

document.getElementById("logout").addEventListener("click", logout);
loadProfile();
