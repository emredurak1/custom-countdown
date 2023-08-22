'use strict';

const music = document.querySelector('audio');
const icon = document.querySelector('.icon');
const inputContainer = document.querySelector('.input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const customAlert = document.querySelector('.custom-alert');
const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// Background Music Operations
let musicActive = false;

const runMusic = function () {
  icon.classList.replace('fa-volume-xmark', 'fa-volume-high');
  icon.title = 'Click to Mute';
  music.play();
  musicActive = false;
};

const pauseMusic = function () {
  icon.classList.replace('fa-volume-high', 'fa-volume-xmark');
  icon.title = 'Click to Run';
  music.pause();
  musicActive = true;
};

const toggleMusic = function () {
  if (musicActive) runMusic();
  else pauseMusic();
};

icon.addEventListener('click', toggleMusic);

// Main Operations

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const timezoneOffset = new Date().getTimezoneOffset() * 60000;
const today = new Date(Date.now() - timezoneOffset)
  .toISOString()
  .slice(0, -5)
  .split('T')[0];

dateEl.setAttribute('min', today);

const updateDOM = function () {
  countdownActive = setInterval(() => {
    const now = new Date().getTime() - timezoneOffset;
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    inputContainer.hidden = true;

    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = days;
      timeElements[1].textContent = hours;
      timeElements[2].textContent = minutes;
      timeElements[3].textContent = seconds;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
};

const updateCountdown = function (e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if (countdownDate === '') {
    customAlert.textContent = 'Please select a date for the countdown!';
    customAlert.hidden = false;
    setTimeout(() => {
      customAlert.hidden = true;
    }, 2500);
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

const reset = function () {
  countdownEl.hidden = true;
  inputContainer.hidden = false;
  completeEl.hidden = true;
  clearInterval(countdownActive);

  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
};

const restorePreviousCountdown = function () {
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

restorePreviousCountdown();
