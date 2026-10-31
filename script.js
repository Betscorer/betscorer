const selections = new Map();

const betList = document.getElementById("bet-list");
const stakeInput = document.getElementById("stake");
const possibleWin = document.getElementById("win");
const selectionCount = document.getElementById("selection-count");
const placeBetButton = document.getElementById("place-bet");
const notice = document.getElementById("notice");

function calculateWin() {
    const stake = Number.parseFloat(stakeInput.value);
    const totalOdds = Math.round(Array.from(selections.values())
        .reduce((total, selection) => total * selection.odd, 1) * 100) / 100;
    const returns = Number.isFinite(stake) && stake > 0 && selections.size > 0
        ? stake * totalOdds
        : 0;

    possibleWin.textContent = returns.toFixed(2);
}

function updateBetSlip() {
    const currentSelections = Array.from(selections.values());
    selectionCount.textContent = currentSelections.length;
    placeBetButton.disabled = currentSelections.length === 0;
    betList.replaceChildren();

    if (currentSelections.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-slip";
        emptyMessage.textContent = "Choose an odd to add a selection.";
        betList.append(emptyMessage);
        possibleWin.textContent = "0.00";
        return;
    }

    currentSelections.forEach((selection) => {
        const item = document.createElement("article");
        item.className = "bet-selection";

        const details = document.createElement("div");
        const pick = document.createElement("strong");
        pick.textContent = selection.pick;
        const match = document.createElement("span");
        match.textContent = selection.match;
        details.append(pick, match);

        const odd = document.createElement("span");
        odd.className = "selection-odd";
        odd.textContent = selection.odd.toFixed(2);

        const remove = document.createElement("button");
        remove.className = "remove-selection";
        remove.type = "button";
        remove.dataset.match = selection.matchId;
        remove.setAttribute("aria-label", `Remove ${selection.pick} selection`);
        remove.textContent = "×";

        item.append(details, odd, remove);
        betList.append(item);
    });

    calculateWin();
}

document.querySelectorAll(".odds button").forEach((button) => {
    button.addEventListener("click", () => {
        const matchId = button.dataset.matchId;
        const wasSelected = button.getAttribute("aria-pressed") === "true";

        document.querySelectorAll(`.odds button[data-match-id="${matchId}"]`)
            .forEach((option) => option.setAttribute("aria-pressed", "false"));

        if (wasSelected) {
            selections.delete(matchId);
        } else {
            button.setAttribute("aria-pressed", "true");
            selections.set(matchId, {
                matchId,
                match: button.dataset.match,
                pick: button.dataset.pick,
                odd: Number(button.dataset.odd)
            });
        }

        notice.textContent = "";
        updateBetSlip();
    });
});

betList.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-selection");
    if (!removeButton) return;

    selections.delete(removeButton.dataset.match);
    document.querySelectorAll(`.odds button[data-match-id="${removeButton.dataset.match}"]`)
        .forEach((button) => button.setAttribute("aria-pressed", "false"));
    updateBetSlip();
});

stakeInput.addEventListener("input", calculateWin);

placeBetButton.addEventListener("click", async () => {
    const stake = Math.round(Number.parseFloat(stakeInput.value) * 100) / 100;

    if (!Number.isFinite(stake) || stake <= 0) {
        notice.textContent = "Enter a stake greater than 0.";
        stakeInput.focus();
        return;
    }

    if (selections.size === 0) {
        notice.textContent = "Choose at least one selection.";
        return;
    }

    placeBetButton.disabled = true;
    try {
        const user = await window.betVerse.requireUser();
        if (!user) return;

        const odds = Math.round(Array.from(selections.values())
            .reduce((total, selection) => total * selection.odd, 1) * 100) / 100;
        const selectionText = Array.from(selections.values())
            .map((selection) => `${selection.pick} (${selection.match})`)
            .join(", ");
        const { error } = await window.sb.rpc("place_demo_bet", {
            p_selection: selectionText,
            p_stake: stake,
            p_odds: odds
        });
        if (error) throw error;

        const profile = await window.betVerse.getProfile(user.id);
        document.getElementById("dashboard-balance").textContent = Number(profile.balance).toFixed(2);
        selections.clear();
        stakeInput.value = "";
        document.querySelectorAll(".odds button")
            .forEach((button) => button.setAttribute("aria-pressed", "false"));
        notice.textContent = "Demo bet saved. View it in My Bets or Bet History.";
        updateBetSlip();
    } catch (error) {
        notice.textContent = error.message || "Unable to place demo bet. Please try again.";
    } finally {
        placeBetButton.disabled = selections.size === 0;
    }
});

updateBetSlip();
