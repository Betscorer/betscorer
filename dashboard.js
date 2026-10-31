const dashboardNotice = document.getElementById("dashboard-notice");

async function loadDashboard() {
    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;
        const profile = await window.betVerse.getProfile(user.id);
        document.getElementById("dashboard-username").textContent = profile.username || "there";
        document.getElementById("dashboard-email").textContent = profile.email || user.email || "No email available";
        document.getElementById("dashboard-balance").textContent = Number(profile.balance).toFixed(2);
    } catch (error) {
        window.betVerse.showError(dashboardNotice, error);
    }
}

document.getElementById("logout").addEventListener("click", async () => {
    const { error } = await window.sb.auth.signOut();
    if (error) {
        window.betVerse.showError(dashboardNotice, error);
        return;
    }
    window.location.href = "login.html";
});

loadDashboard();
