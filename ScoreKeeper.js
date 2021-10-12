// ISSUES: Doesn't handle multiple keyup presses properly.
let isKeyDown = false;
const player1 = {
	scoreSpan: document.querySelector("#player-1"),
	scoreBtn: document.querySelector("#button-1 button"),
};
const player2 = {
	scoreSpan: document.querySelector("#player-2"),
	scoreBtn: document.querySelector("#button-2 button"),
};

let resetBtn = document.querySelector("#button-3 button");
let scoreLimitSelect = document.querySelector("#score-limit-select");
let isGameRunning = true;

// When player1.scoreBtn is clicked Player 1 scores a point:
player1.scoreBtn.addEventListener("click", function (e) {
	play(player1, player2);
});

// When player2.scoreBtn is clicked Player 2 scores a point:
player2.scoreBtn.addEventListener("click", function (e) {
	play(player2, player1);
});

// disable and record keydown after one key is pressed (it repeats if the key is kept down, which is undesirable)
// re-enabled isKeyDown once the recorded key is released (on keyup).
let key = "";
document.addEventListener("keydown", (e) => {
	if (!isKeyDown) {
		if (
			e.key === "1" ||
			e.key === "ArrowLeft" ||
			e.key === "2" ||
			e.key === "ArrowRight"
		) {
			key = e.key;
			isKeyDown = true;
		}
	}
});

// perform action corresponding to the key that was pressed (recorded on keydown)
// re-enable isKeyDown
document.addEventListener("keyup", (e) => {
	if (e.key === "Escape") {
		resetGame();
	}
	if (isGameRunning) {
		if (isKeyDown)
			if (key === "1" || key === "ArrowLeft") {
				play(player1, player2);
			} else if (key === "2" || key === "ArrowRight") {
				play(player2, player1);
			}
	}
	isKeyDown = false;
	key = "";
});

// increments the appropriate player's score and determines if there's a winner yet.
// NB: p1 & p2 are relative to the method in which it is called (not necessarily player1 followed by player 2).
const play = (p1, p2) => {
	p1.scoreSpan.innerText = parseInt(p1.scoreSpan.innerText) + 1;
	determineWinner(p1.scoreSpan, p2.scoreSpan);
};

// Game Logic
const determineWinner = (score1, score2) => {
	if (parseInt(score1.innerText) >= parseInt(scoreLimitSelect.value)) {
		// player 1 wins:
		// display the winner and loser
		score1.style.color = "green";
		score2.style.color = "red";

		// disable button1, button2
		disableButtons();

		// game is over
		isGameRunning = false;
	} else if (parseInt(score2.innerText) >= parseInt(scoreLimitSelect.value)) {
		// player 2 wins
		// display the winner and loser
		score2.style.color = "green";
		score1.style.color = "red";

		// disable button1, button2
		disableButtons();

		// game is over
		isGameRunning = false;
	}

	// neither player has won yet, nothing should happen
};

// When resetBtn is clicked:
// if -> (isGameRunning = true) - only the score needs resetting
// else -> reset the entire game back to initial state.
resetBtn.addEventListener("click", function (e) {
	if (!isGameRunning) {
		resetGame();
	} else {
		player1.scoreSpan.innerText = "0";
		player2.scoreSpan.innerText = "0";
	}
});

// If the score limit changes the game should be set back to its initial state:
scoreLimitSelect.addEventListener("change", (e) => {
	if (isGameRunning) {
		player1.scoreBtn.classList.toggle("disable-button");
		player2.scoreBtn.classList.toggle("disable-button");
	}
	resetGame();

	// Required: remove focus from this element as it will cause conflict when user uses numpad or up/down arrows
	document.activeElement.blur();
});

// Disable player1.scoreBtn & player2.scoreBtn because the game has reached its end.
const disableButtons = () => {
	player1.scoreBtn.disabled = true;
	player2.scoreBtn.disabled = true;
	player1.scoreBtn.style.cursor = "default";
	player2.scoreBtn.style.cursor = "default";
	player1.scoreBtn.classList.add("disable-button");
	player2.scoreBtn.classList.add("disable-button");
};

// Reset game back to its initial state.
const resetGame = () => {
	player2.scoreSpan.style.color = "black";
	player1.scoreSpan.style.color = "black";
	player2.scoreSpan.innerText = "0";
	player1.scoreSpan.innerText = "0";
	player1.scoreBtn.disabled = false;
	player2.scoreBtn.disabled = false;
	player1.scoreBtn.style.cursor = "pointer";
	player2.scoreBtn.style.cursor = "pointer";
	player1.scoreBtn.classList.remove("disable-button");
	player2.scoreBtn.classList.remove("disable-button");

	// start of a new game (game runs again)
	isGameRunning = true;
};
