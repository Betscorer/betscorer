const walletBalance = document.getElementById("balance");
const walletMessage = document.getElementById("wallet-message");
const walletButton = document.querySelector("button[data-wallet-action]");

async function submitWalletAction() {
    walletMessage.textContent = "";
    walletButton.disabled = true;

    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;

        const amount = Number(document.getElementById("amount").value);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Enter an amount greater than 0.");
        }

        const { error } = await window.sb.rpc("change_demo_balance", {
            p_amount: walletButton.dataset.walletAction === "deposit" ? amount : -amount
        });
        if (error) throw error;

        const profile = await window.betVerse.getProfile(user.id);
        if (walletBalance) {
            walletBalance.textContent = Number(profile.balance).toFixed(2);
        }
        walletMessage.textContent = "Demo balance updated.";
        if (document.getElementById("amount")) {
            document.getElementById("amount").value = "";
        }
    } catch (error) {
        window.betVerse.showError(walletMessage, error);
    } finally {
        walletButton.disabled = false;
    }
}

if (walletButton) {
    walletButton.addEventListener("click", submitWalletAction);
}

async function loadWalletBalance() {
    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;
        const profile = await window.betVerse.getProfile(user.id);
        walletBalance.textContent = Number(profile.balance).toFixed(2);
    } catch (error) {
        window.betVerse.showError(walletMessage, error);
    }
}

loadWalletBalance();
