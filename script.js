const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score1');
const hintBtn = document.getElementById('hint-btn');
const exitBtn = document.getElementById('exit-btn');
const helperCat = document.getElementById('helper-cat');

let timer = 75;
let score = 0;
let flippedCards = [];
let lockBoard = false;
let hintsLeft = 2;
let gameEnded = false;

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("card-grid");
  const cardCount = 16; 

  let cards = [];

  for (let i = 1; i <= cardCount / 2; i++) {
    const cardImage = `assets/img/карточки/к${i}.png`;
    cards.push({ image: cardImage });
    cards.push({ image: cardImage });
  }

  cards = cards.sort(() => Math.random() - 0.5);

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front"><img src="assets/img/рубашкаа.png" alt="Back"></div>
        <div class="card-back"><img src="${card.image}" alt="Card"></div>
      </div>
    `;

    grid.appendChild(cardElement);
    cardElement.addEventListener('click', () => flipCard(cardElement));
  });
});

function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flippedCards;
  const imgA = a.querySelector('.card-back img').src.split('/').pop();
  const imgB = b.querySelector('.card-back img').src.split('/').pop();

  if (imgA === imgB) {
    score += 10;
    scoreEl.textContent = score;
    flippedCards = [];

    // все ли карточки перевернуты
    const allCards = document.querySelectorAll('.card');
    const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));

    if (allFlipped) {
      clearInterval(countdown); 
      endGame();
    }

  } else {
    lockBoard = true;
    setTimeout(() => {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

// Таймер
const countdown = setInterval(() => {
  timer--;
  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');
  timerEl.textContent = `${min}:${sec}`;

  if (timer <= 0) {
    clearInterval(countdown);
    endGame();
  }
}, 1000);

// Подсказка
hintBtn.addEventListener('click', () => {
  if (hintsLeft === 0) return;
  hintsLeft--;

  const allCards = document.querySelectorAll('.card');

  //были открыты ДО подсказки
  const alreadyFlipped = Array.from(allCards).filter(card => card.classList.contains('flipped'));


  allCards.forEach(c => c.classList.add('flipped'));

  setTimeout(() => {
    allCards.forEach(card => {
      if (!alreadyFlipped.includes(card)) {
        card.classList.remove('flipped');
      }
    });
  }, 1000);

  if (hintsLeft === 0) {
    hintBtn.style.pointerEvents = 'none';
    hintBtn.style.opacity = 0.5;
  }
});


// Выход
exitBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Хелпер
helperCat.addEventListener('click', () => {
  window.location.href = 'rules.html';
});


// Победа/поражение
function endGame() {
  if (gameEnded) return;
  gameEnded = true;

  const totalPossible = document.querySelectorAll('.card').length / 2 * 10;

  if (score >= totalPossible / 2) {
    window.location.href = 'victory.html';
  } else {
    window.location.href = 'defeat.html';
  }
}
