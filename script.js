const passages = [
  "The quick brown fox jumps over the lazy dog.",
  "Success is the sum of small efforts repeated every single day.",
  "Great things are built one step at a time with patience and consistency.",
  "Your future depends on what you do today, so keep moving forward.",
  "The best way to improve your typing speed is to practice every day.",
  "Technology gives us powerful tools to create ideas and turn them into reality."
];

const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");

const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const errorsElement = document.getElementById("errors");

const countdownElement = document.getElementById("countdown");
const progressBar = document.getElementById("progressBar");

const startButton = document.getElementById("startButton");

const result = document.getElementById("result");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalErrors = document.getElementById("finalErrors");
const restartButton = document.getElementById("restartButton");

let currentText = "";
let timeLeft = 60;
let timer = null;
let raceStarted = false;
let errors = 0;
let totalTyped = 0;


/* PICK RANDOM TEXT */

function getRandomText() {
  return passages[Math.floor(Math.random() * passages.length)];
}


/* DISPLAY TEXT */

function loadText() {

  currentText = getRandomText();

  textDisplay.innerHTML = "";

  currentText.split("").forEach((character, index) => {

    const span = document.createElement("span");

    span.textContent = character;

    if (index === 0) {
      span.classList.add("current");
    }

    textDisplay.appendChild(span);
  });
}


/* START COUNTDOWN */

function startCountdown() {

  let count = 3;

  countdownElement.textContent = count;

  const countdown = setInterval(() => {

    count--;

    if (count > 0) {
      countdownElement.textContent = count;
    }

    if (count === 0) {

      countdownElement.textContent = "GO!";

      clearInterval(countdown);

      setTimeout(() => {
        countdownElement.textContent = "TYPE AS FAST AS YOU CAN";
        startRace();
      }, 500);
    }

  }, 1000);
}


/* START RACE */

function startRace() {

  raceStarted = true;

  typingInput.disabled = false;
  typingInput.focus();

  timer = setInterval(() => {

    timeLeft--;

    timerElement.textContent = timeLeft;

    const progress = ((60 - timeLeft) / 60) * 100;

    progressBar.style.width = `${progress}%`;

    updateStats();

    if (timeLeft <= 0) {
      endRace();
    }

  }, 1000);
}


/* TYPING */

typingInput.addEventListener("input", () => {

  if (!raceStarted) return;

  const typedText = typingInput.value;

  totalTyped = typedText.length;

  errors = 0;

  const characters = textDisplay.querySelectorAll("span");

  characters.forEach((character, index) => {

    character.classList.remove("correct", "incorrect", "current");

    const typedCharacter = typedText[index];

    if (typedCharacter == null) {

      if (index === typedText.length) {
        character.classList.add("current");
      }

      return;
    }

    if (typedCharacter === character.textContent) {
      character.classList.add("correct");
    } else {
      character.classList.add("incorrect");
      errors++;
    }

  });

  updateStats();

  /* FINISHED PASSAGE */

  if (typedText === currentText) {

    typingInput.value = "";

    loadText();

  }

});


/* UPDATE STATS */

function updateStats() {

  const elapsedTime = 60 - timeLeft;

  if (elapsedTime <= 0) return;

  const minutes = elapsedTime / 60;

  const words = typingInput.value.trim().length / 5;

  const wpm = Math.round(words / minutes);

  const correctCharacters = Math.max(
    totalTyped - errors,
    0
  );

  const accuracy = totalTyped === 0
    ? 100
    : Math.round((correctCharacters / totalTyped) * 100);

  wpmElement.textContent = wpm;
  accuracyElement.textContent = `${accuracy}%`;
  errorsElement.textContent = errors;
}


/* END RACE */

function endRace() {

  clearInterval(timer);

  raceStarted = false;

  typingInput.disabled = true;

  const wpm = wpmElement.textContent;
  const accuracy = accuracyElement.textContent;

  finalWpm.textContent = wpm;
  finalAccuracy.textContent = accuracy;
  finalErrors.textContent = errors;

  result.classList.remove("hidden");

  countdownElement.textContent = "RACE FINISHED 🏁";
}


/* RESET */

function resetRace() {

  clearInterval(timer);

  timeLeft = 60;
  errors = 0;
  totalTyped = 0;
  raceStarted = false;

  timerElement.textContent = "60";
  wpmElement.textContent = "0";
  accuracyElement.textContent = "100%";
  errorsElement.textContent = "0";

  progressBar.style.width = "0%";

  typingInput.value = "";
  typingInput.disabled = true;

  result.classList.add("hidden");

  countdownElement.textContent = "PRESS START";

  loadText();
}


/* BUTTONS */

startButton.addEventListener("click", () => {

  if (raceStarted) return;

  startButton.disabled = true;

  loadText();

  startCountdown();

  setTimeout(() => {
    startButton.disabled = false;
  }, 4000);

});


restartButton.addEventListener("click", () => {

  resetRace();

});


/* INITIAL */

resetRace();
