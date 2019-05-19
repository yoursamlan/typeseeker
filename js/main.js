window.addEventListener('load', init);

// Initialize Game
function init() {
  // Setup loading text
  wordInput.placeholder = 'Loading...';
  wordInput.disabled = true;
  // Load text
  loadWords();
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  setInterval(checkStatus, 50);
}

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');

// Available Levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 1
};

// To change level
const currentLevel = levels.medium;

// Global Vars
let time = currentLevel;
let score = 0;
let isPlaying;

let words = null;

// Downloads the word list
function loadWords() {
  fetch('data/twl06.txt')
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      let lines = text.split(/\r?\n/);
      lines.pop(0);
      lines.pop(0);
      words = lines;
      score = -1;
      wordInput.disabled = false;
      wordInput.placeholder = 'Start typing...';
      timeDisplay.innerHTML = currentLevel;
      showWord(words);
    });
}

// Start match
function startMatch() {
  if (words === null) {
    return;
  }

  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = '';
    score++;
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value.toLowerCase() === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
let lastWord = "";
// Generate random array index
let randIndex = Math.floor(Math.random() * words.length);
function showWord(words) {
  // Check if the random word is the same as the previous (it is, always, during the first check)
  while (words[randIndex] === lastWord) {
	// If yes, generate a new random index and check again
    randIndex = Math.floor(Math.random() * words.length);
  }
  // Store the new word
  lastWord = words[randIndex];
  // Output random word
  currentWord.innerHTML = lastWord;
}

// Countdown timer
function countdown() {
  if(!isPlaying) {
    return;
  }

  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
    message.innerHTML = ' Game Over!!!';
    score = -1;
  }
}
