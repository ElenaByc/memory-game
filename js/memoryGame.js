import { saveResultToLocalStorage, getResultsFromLocalStorage } from './localStorageUtils.js';

export const memoryGame = () => {
  const startButton = document.querySelector('.start');
  const cardsContainer = document.querySelector('.cards-container');
  const cards = document.querySelectorAll('.card');
  const turnsCounter = document.querySelector('.turns-number');
  const timerElement = document.querySelector('.elapsed-time');
  const gameResult = document.querySelector('.game-result');
  const resultTime = document.querySelector('.result-time');
  const resultTurns = document.querySelector('.result-turns');
  const themeElement = document.querySelector('.theme');
  const themeButton = document.querySelector('.change-theme');
  const themesArray = ['sport', 'flowers', 'math', 'music'];
  const colorsArray = ['#0066AA', '#990011', '#226622', '#773300']

  let records = document.querySelectorAll('tr');
  let lastRecord = records[records.length - 1];

  const clickSound = new Audio('./assets/audio/classic-click.wav');
  const winSound = new Audio('./assets/audio/game-win.wav');
  const startSound = new Audio('./assets/audio/alert.wav');
  const matchSound = new Audio('./assets/audio/achievement-bell.wav');

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard;
  let secondCard;
  let turns = 0;
  let matches = 0;
  let startTime;
  let timer;

  const startGame = () => {
    themeButton.removeEventListener('click', changeTheme);
    themeButton.style.cursor = 'not-allowed';
    startSound.play();
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
    cards.forEach(card => card.classList.remove('flip'));
    startButton.classList.add('hide');
    gameResult.classList.add('hide');
    cardsContainer.classList.remove('hide');
    lastRecord.classList.remove('last');

    turns = 0;
    matches = 0;
    turnsCounter.textContent = 0;


    resetBoard()
    startTimer();
  }

  const startTimer = () => {
    startTime = new Date().getTime();
    timer = setInterval(() => {
        let currentTime = new Date().getTime();
        let time = currentTime - startTime;
        let min = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let sec = Math.floor((time % (1000 * 60)) / 1000);
        timerElement.innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
    }, 1000);
  }

  function flipCard() {
    if (lockBoard) {
      return;
    }

    if (this === firstCard) {
      return;
    }

    this.classList.add('flip');
    clickSound.play();

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    turns++;
    turnsCounter.textContent = turns;
    checkForMatch();
  }

  function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
      matches += 1;
      if (matches === 6) {
          endGame();
          return;
      }
      
      matchSound.play();
      disableCards();

      // lockBoard = true;
      // setTimeout(() => {
      //   lockBoard = false;
      // }, 100);

      return;
    }
    unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1500);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function shuffle() {
    cards.forEach(card => {
      let ramdomPos = Math.floor(Math.random() * 12);
      card.style.order = ramdomPos;
    });
  }

  function endGame() {
    winSound.play();
    disableCards();
    clearInterval(timer);
    setTimeout(() => {
      cardsContainer.classList.add('hide');
      resultTime.innerHTML = timerElement.innerHTML;
      resultTurns.textContent = turns;
      gameResult.classList.remove('hide');
      startButton.classList.remove('hide');
      let str = timerElement.textContent;
      saveResultToLocalStorage(str, turns);
      getResultsFromLocalStorage();
      records = document.querySelectorAll('tr');
      lastRecord = records[records.length - 1];
      lastRecord.classList.add('last');
    }, 1000);
    themeButton.addEventListener('click', changeTheme); 
    themeButton.style.cursor = 'pointer';
  }

  function changeTheme () {
    clickSound.play();
    const currentTheme = themeElement.textContent;
    let index = themesArray.indexOf(currentTheme);
    index++;
    index %= 4;
    const nextTheme = themesArray[index];
    const color = colorsArray[index];
  
    themeElement.textContent = nextTheme;
    themeElement.style.color = color;

    const backFace = document.querySelectorAll('.back-face');
    backFace.forEach(elem => {
      elem.style.backgroundImage = `url('./assets/img/${nextTheme}/pattern.svg')`;
    });

    cards.forEach(card => {
      card.style.borderColor= color;
    });

    let frontFace;
    for (let i = 1; i <=6; i++) {
      frontFace = document.querySelectorAll(`[data-card="${i}"] .front-face`);
      frontFace.forEach(elem => {
        elem.style.backgroundImage = `url('./assets/img/${nextTheme}/${i}.svg')`;
      });
    }
  }

  startButton.addEventListener('click', startGame);
  themeButton.addEventListener('click', changeTheme); 
}