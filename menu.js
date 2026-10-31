const menuToggle = document.getElementById("menu-toggle");
const siteMenu = document.getElementById("site-menu");
const menuBackdrop = document.getElementById("menu-backdrop");
const menuClose = document.getElementById("menu-close");

function setMenuOpen(isOpen) {
    siteMenu.hidden = !isOpen;
    menuBackdrop.hidden = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

    if (isOpen) {
        menuClose.focus();
    } else {
        menuToggle.focus();
    }
}

menuToggle.addEventListener("click", () => {
    setMenuOpen(siteMenu.hidden);
});

menuClose.addEventListener("click", () => setMenuOpen(false));
menuBackdrop.addEventListener("click", () => setMenuOpen(false));

siteMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !siteMenu.hidden) setMenuOpen(false);
});
