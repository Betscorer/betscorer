const homeAuth = document.getElementById("home-auth");

function createHomeLink(label, href, className) {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = href;
    link.className = className;
    return link;
}

function renderHomeAuth(user) {
    homeAuth.replaceChildren();

    if (!user) {
        homeAuth.append(
            createHomeLink("Log in", "login.html", "login"),
            createHomeLink("Join now", "join%20now.html", "register")
        );
        return;
    }

    homeAuth.append(createHomeLink("Dashboard", "dashboard.html", "login"));
    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "register dashboard-logout";
    logout.textContent = "Log out";
    logout.addEventListener("click", async () => {
        logout.disabled = true;
        const { error } = await window.sb.auth.signOut();
        if (error) {
            logout.disabled = false;
            showHomeAuthError(error);
        }
    });
    homeAuth.append(logout);
}

function showHomeAuthError(error) {
    let message = document.getElementById("home-auth-error");
    if (!message) {
        message = document.createElement("span");
        message.id = "home-auth-error";
        message.className = "home-auth-error";
        message.setAttribute("role", "alert");
        homeAuth.append(message);
    }
    message.textContent = error.message || "Unable to update your sign-in status.";
}

async function initializeHomeAuth() {
    const { data, error } = await window.sb.auth.getSession();
    if (error) {
        showHomeAuthError(error);
        return;
    }
    renderHomeAuth(data.session?.user || null);
    window.sb.auth.onAuthStateChange((_event, session) => {
        renderHomeAuth(session?.user || null);
    });
}

initializeHomeAuth().catch(showHomeAuthError);
