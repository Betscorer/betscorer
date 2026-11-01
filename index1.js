const homeAuth = document.getElementById("home-auth");

function createHomeLink(label, href, className) {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = href;
    link.className = className;
    return link;
}

function renderHomeAuth() {

    homeAuth.replaceChildren();

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    if (!currentUser) {

        homeAuth.append(
            createHomeLink("Log in", "login.html", "login"),
            createHomeLink("Join now", "join%20now.html", "register")
        );

        return;
    }

    homeAuth.append(
        createHomeLink(
            "Dashboard",
            "dashboard.html",
            "login"
        )
    );

    const logout =
        document.createElement("button");

    logout.className = "register";

    logout.textContent = "Log out";

    logout.onclick = () => {

        localStorage.removeItem(
            "currentUser"
        );

        location.reload();

    };

    homeAuth.append(logout);
}

renderHomeAuth();