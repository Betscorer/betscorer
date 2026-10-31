const recordList = document.getElementById("bet-records");

async function loadBetRecords() {
    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;

        const pagePath = window.location.pathname.toLowerCase();
        const isHistoryPage = pagePath.includes("history");
        const isResultsPage = pagePath.endsWith("/result.html");
        let query = window.sb.from("bets")
            .select("id, selection, stake, odds, win, status, placed_at")
            .eq("user_id", user.id)
            .order("placed_at", { ascending: false });

        if (isResultsPage) query = query.in("status", ["Won", "Lost"]);
        if (!isHistoryPage && !isResultsPage) query = query.eq("status", "Pending");

        const { data: records, error } = await query;
        if (error) throw error;
        if (records.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-slip";
            emptyMessage.textContent = isHistoryPage
                ? "No bet history yet."
                : isResultsPage
                    ? "No settled bets yet."
                    : "No pending bets. Add a selection from the dashboard to get started.";
            recordList.append(emptyMessage);
            return;
        }

        records.forEach((record) => {
            const card = document.createElement("article");
            card.className = "bet-record";

            const heading = document.createElement("div");
            heading.className = "bet-record-heading";
            const selection = document.createElement("h2");
            selection.textContent = record.selection || "Bet selection";
            const status = document.createElement("span");
            status.className = "bet-status";
            status.textContent = record.status || "Pending";
            heading.append(selection, status);

            const details = document.createElement("div");
            details.className = "bet-record-details";
            [
                ["Stake", `$${Number(record.stake).toFixed(2)}`],
                ["Odds", Number(record.odds).toFixed(2)],
                ["Potential win", `$${Number(record.win).toFixed(2)}`]
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
            const date = new Date(record.placed_at);
            if (Number.isFinite(date.getTime())) {
                const placedAt = document.createElement("p");
                placedAt.className = "bet-record-date";
                placedAt.textContent = `Placed ${date.toLocaleString()}`;
                card.append(placedAt);
            }
            recordList.append(card);
        });
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.className = "empty-slip";
        window.betVerse.showError(errorMessage, error);
        recordList.append(errorMessage);
    }
}

loadBetRecords();
