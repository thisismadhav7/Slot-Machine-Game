const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

let balance = 0;

document.getElementById("deposit-btn").addEventListener("click", () => {
    const depositAmount = parseFloat(document.getElementById("deposit").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount. Please enter a positive number.");
        return;
    }
    balance = depositAmount;
    updateBalance();
});

document.getElementById("spin-btn").addEventListener("click", () => {
    const numberOfLines = parseFloat(document.getElementById("lines").value);
    const bet = parseFloat(document.getElementById("bet").value);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        alert("Invalid number of lines. Please enter a number between 1 and 3.");
        return;
    }

    if (isNaN(bet) || bet <= 0 || bet > balance / numberOfLines) {
        alert("Invalid bet amount. Please check your balance and bet.");
        return;
    }

    balance -= bet * numberOfLines;
    updateBalance();

    const reels = spin();
    const rows = transpose(reels);
    displayReels(rows);

    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    updateBalance();

    document.getElementById("result").textContent = `You won: $${winnings}`;
});

function updateBalance() {
    document.getElementById("balance").textContent = `Balance: $${balance}`;
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

function transpose(reels) {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function displayReels(rows) {
    const reelsElement = document.getElementById("reels");
    reelsElement.innerHTML = "";
    for (const row of rows) {
        for (const symbol of row) {
            const reelElement = document.createElement("div");
            reelElement.classList.add("reel");
            reelElement.textContent = symbol;
            reelsElement.appendChild(reelElement);
        }
    }
}

function getWinnings(rows, bet, lines) {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}