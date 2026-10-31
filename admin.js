const adminBets = document.getElementById("admin-bets");

async function loadAdminBets() {
    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;
        if (user.app_metadata?.role !== "admin") {
            throw new Error("Administrator access is required.");
        }

        const { data: bets, error } = await window.sb
            .from("bets")
            .select("id, selection, stake, odds, win, status, placed_at")
            .order("placed_at", { ascending: false });
        if (error) throw error;

        adminBets.replaceChildren();
        if (bets.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-slip";
            emptyMessage.textContent = "No demo bets have been placed yet.";
            adminBets.append(emptyMessage);
            return;
        }

        bets.forEach((bet) => {
            const card = document.createElement("article");
            card.className = "bet-record";

            const heading = document.createElement("div");
            heading.className = "bet-record-heading";
            const selection = document.createElement("h2");
            selection.textContent = bet.selection || "Bet selection";
            const status = document.createElement("span");
            status.className = "bet-status";
            status.textContent = bet.status || "Pending";
            heading.append(selection, status);

            const details = document.createElement("div");
            details.className = "bet-record-details";
            [
                ["Stake", `$${Number(bet.stake).toFixed(2)}`],
                ["Odds", Number(bet.odds).toFixed(2)],
                ["Potential win", `$${Number(bet.win).toFixed(2)}`]
            ].forEach(([label, value]) => {
                const detail = document.createElement("p");
                const detailLabel = document.createElement("span");
                detailLabel.textContent = label;
                const detailValue = document.createElement("strong");
                detailValue.textContent = value;
                detail.append(detailLabel, detailValue);
                details.append(detail);
            });
            card.append(heading, details);

            if (bet.status === "Pending") {
                const actions = document.createElement("div");
                actions.className = "admin-bet-actions";
                [
                    ["Won", "Mark Won", "admin-win"],
                    ["Lost", "Mark Lost", "admin-loss"]
                ].forEach(([statusValue, label, className]) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = className;
                    button.dataset.betId = bet.id;
                    button.dataset.status = statusValue;
                    button.textContent = label;
                    actions.append(button);
                });
                card.append(actions);
            }
            adminBets.append(card);
        });
    } catch (error) {
        const message = document.createElement("p");
        message.className = "empty-slip";
        window.betVerse.showError(message, error);
        adminBets.replaceChildren(message);
    }
}

adminBets.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-bet-id][data-status]");
    if (!button) return;

    button.disabled = true;
    try {
        const { error } = await window.sb.rpc("settle_demo_bet", {
            p_bet_id: button.dataset.betId,
            p_status: button.dataset.status
        });
        if (error) throw error;
        await loadAdminBets();
    } catch (error) {
        button.disabled = false;
        window.betVerse.showError(adminBets, error);
    }
});

loadAdminBets();
