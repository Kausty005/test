const CONFIG = {
  birthdayName: "Vedanti"
};

const sparkleField = document.querySelector(".sparkle-field");
const cursorHeart = document.querySelector(".cursor-heart");
const gate = document.querySelector("[data-gate]");
const gateStatus = document.querySelector("[data-gate-status]");
const blowButton = document.querySelector("[data-blow-candle]");
const wishFlame = document.querySelector("[data-wish-flame]");
const candleScene = document.querySelector("[data-candle-scene]");

const peopleGrid = document.querySelector("[data-people-grid]");
const modal = document.querySelector("[data-modal]");
const modalName = document.querySelector("[data-modal-name]");
const modalVideo = document.querySelector("[data-modal-video]");

let birthdayRevealed = false;

document.querySelector("[data-birthday-name]").textContent = CONFIG.birthdayName;
document.body.classList.add("locked");

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createFallingPiece(type = "sparkle") {
  const piece = document.createElement("span");
  piece.className = type;
  piece.style.left = `${randomBetween(0, 100)}vw`;
  piece.style.setProperty("--drift", `${randomBetween(-90, 90)}px`);
  piece.style.animationDuration = `${randomBetween(4.8, 9)}s`;

  if (type === "sparkle") {
    piece.textContent = Math.random() > 0.5 ? "\u2726" : "\u2661";
  } else {
    const colors = ["#ff7aa9", "#bde7ff", "#b9f3da", "#ffe98a", "#ffd4bd"];
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
  }

  sparkleField.appendChild(piece);
  piece.addEventListener("animationend", () => piece.remove(), { once: true });
}

function burstConfetti(amount = 46) {
  for (let i = 0; i < amount; i += 1) {
    setTimeout(() => createFallingPiece("confetti"), i * 18);
  }
}

setInterval(() => createFallingPiece("sparkle"), 650);
setTimeout(() => burstConfetti(64), 450);

document.addEventListener("pointermove", (event) => {
  cursorHeart.style.opacity = "1";
  cursorHeart.style.left = `${event.clientX}px`;
  cursorHeart.style.top = `${event.clientY}px`;
});

document.querySelector("[data-confetti]").addEventListener("click", () => burstConfetti(70));

/* ---- Candle blow gate logic ---- */
function blowCandle() {
  if (birthdayRevealed) return;

  /* Blow out the flame */
  wishFlame.classList.add("is-blown");
  candleScene.classList.add("is-blown");
  blowButton.disabled = true;

  gateStatus.textContent = "✨ Your wish is on its way... ✨";
  burstConfetti(50);

  setTimeout(revealBirthdayPage, 1400);
}

function revealBirthdayPage() {
  if (birthdayRevealed) return;
  birthdayRevealed = true;
  gate.classList.add("is-open");
  document.body.classList.remove("locked");
  burstConfetti(100);
  setTimeout(() => {
    gate.hidden = true;
  }, 550);
}

blowButton.addEventListener("click", blowCandle);



/* ---- People / messages ---- */
const surpriseEmojis = ["🎁", "🎀", "🌟", "💝", "🎊", "✨", "🦋", "🌈"];

function loadPeople() {
  return PEOPLE || [];
}

function renderPeople(people) {
  const template = document.querySelector("#person-template");
  peopleGrid.innerHTML = "";

  people.forEach((person, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const surpriseNum = index + 1;
    const emoji = surpriseEmojis[index % surpriseEmojis.length];

    /* Card front shows "Surprise N" */
    node.querySelector(".person-name").textContent = `${emoji} Surprise ${surpriseNum}`;
    node.querySelector(".avatar").style.setProperty("--card-color", person.color || "#ffd4bd");

    /* Store the real data */
    node.dataset.realName = person.name;
    node.dataset.revealed = "false";

    node.addEventListener("click", () => handleCardClick(node, person));
    peopleGrid.appendChild(node);
  });
}

function handleCardClick(card, person) {
  /* Mark as revealed visually */
  if (card.dataset.revealed === "false") {
    card.dataset.revealed = "true";
    card.classList.add("is-revealed");
    card.querySelector(".person-name").textContent = person.name;
  }

  /* Open video directly */
  openModal(person);
}

function openModal(person) {
  modalName.textContent = person.name;
  modalVideo.src = person.video;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalVideo.focus();
}

function closeModal() {
  modal.hidden = true;
  modalVideo.pause();
  modalVideo.onerror = null;
  modalVideo.removeAttribute("src");
  modalVideo.load();
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});


renderPeople(loadPeople());
