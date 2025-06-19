const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score1');
const hintBtn = document.getElementById('hint-btn');
const exitBtn = document.getElementById('exit-btn');
const helperCat = document.getElementById('helper-cat');

let timer = 180;
let score = 0;
let flippedCards = [];
let lockBoard = false;
let hintsLeft = 2;
let gameEnded = false;

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("card-grid");
  const cardCount = 25; // теперь 25 карточек

  let cards = [];

  // Создаем пары для первых 12 карточек (24 штуки)
  for (let i = 1; i <= 12; i++) {
    const cardImage = `assets/img/карточки/к${i}.png`;
    cards.push({ image: cardImage });
    cards.push({ image: cardImage });
  }

  // Добавляем особую карточку "чашка.png"
  cards.push({ image: 'assets/img/карточки/чашка.png', special: true });

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

    if (card.special) {
      cardElement.dataset.special = 'true';
    }

    grid.appendChild(cardElement);
    cardElement.addEventListener('click', () => flipCard(cardElement));
  });
});

// Логика переворота и подсчета
function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  // Особая карточка "чашка" — сразу начисляем 10 очков
  if (card.dataset.special === 'true') {
    card.classList.add('flipped');
    score += 10;
    scoreEl.textContent = score;
    checkForWin();
    return;
  }

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

    checkForWin();

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

function checkForWin() {
  const allCards = document.querySelectorAll('.card');
  const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));

  if (allFlipped) {
    clearInterval(countdown);
    endGame();
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

  // были открыты ДО подсказки
  const alreadyFlipped = Array.from(allCards).filter(card => card.classList.contains('flipped'));

  
  allCards.forEach(c => c.classList.add('flipped'));

  setTimeout(() => {
    allCards.forEach(card => {
      // Убираем класс 'flipped' только у тех, кто НЕ был открыт ДО подсказки
      if (!alreadyFlipped.includes(card)) {
        card.classList.remove('flipped');
      }
    });
  }, 2000);

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
  window.location.href = 'rules2.html';
});

// Победа/поражение
function endGame() {
  if (gameEnded) return;
  gameEnded = true;

  const totalPossible = (document.querySelectorAll('.card').length - 1) / 2 * 10 + 10; // учитываем особую карточку

  if (score >= totalPossible / 2) {
    window.location.href = 'victory.html';
  } else {
    window.location.href = 'defeat.html';
  }
}

// Обработка ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    window.location.href = 'index_mainscreen.html';
  }
});
