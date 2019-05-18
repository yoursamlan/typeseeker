window.addEventListener('load', init);

// Initialize Game
function init() {
  // Setup loading text
  wordInput.value = 'Loading...';
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
      wordInput.disabled = false;
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
  if (wordInput.value.trim() === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown() {
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
