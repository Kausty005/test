const CONFIG = {
  birthdayName: "Vedanti",
  fallbackPeople: [
    {
      name: "Person 1",
      relation: "Your first surprise",
      video: "assets/videos/1.mp4",
      note: "Add video at assets/videos/1.mp4",
      color: "#ffd4bd"
    },
    {
      name: "Person 2",
      relation: "Your second surprise",
      video: "assets/videos/2.mp4",
      note: "Add video at assets/videos/2.mp4",
      color: "#bde7ff"
    },
    {
      name: "Person 3",
      relation: "Your third surprise",
      video: "assets/videos/3.mp4",
      note: "Add video at assets/videos/3.mp4",
      color: "#b9f3da"
    },
    {
      name: "Person 4",
      relation: "Your fourth surprise",
      video: "assets/videos/4.mp4",
      note: "Add video at assets/videos/4.mp4",
      color: "#ffe98a"
    },
    {
      name: "Person 5",
      relation: "Your fifth surprise",
      video: "assets/videos/5.mp4",
      note: "Add video at assets/videos/5.mp4",
      color: "#f3c4fb"
    },
    {
      name: "Person 6",
      relation: "Your sixth surprise",
      video: "assets/videos/6.mp4",
      note: "Add video at assets/videos/6.mp4",
      color: "#c4f0c5"
    },
    {
      name: "Person 7",
      relation: "Your seventh surprise",
      video: "assets/videos/7.mp4",
      note: "Add video at assets/videos/7.mp4",
      color: "#ffccd5"
    },
    {
      name: "Person 8",
      relation: "Your eighth surprise",
      video: "assets/videos/8.mp4",
      note: "Add video at assets/videos/8.mp4",
      color: "#a2d2ff"
    }
  ]
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
const modalNote = document.querySelector("[data-modal-note]");

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

async function loadPeople() {
  try {
    const response = await fetch("assets/people.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No people file yet");
    return await response.json();
  } catch {
    return CONFIG.fallbackPeople;
  }
}

function renderPeople(people) {
  const template = document.querySelector("#person-template");
  peopleGrid.innerHTML = "";

  people.forEach((person, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const surpriseNum = index + 1;
    const emoji = surpriseEmojis[index % surpriseEmojis.length];

    /* Card front shows "Surprise N" — relation is hidden */
    node.querySelector(".person-name").textContent = `${emoji} Surprise ${surpriseNum}`;
    node.querySelector(".person-relation").textContent = "Tap to reveal";
    node.querySelector(".avatar").style.setProperty("--card-color", person.color || "#ffd4bd");

    /* Store the real data */
    node.dataset.realName = person.name;
    node.dataset.realRelation = person.relation;
    node.dataset.revealed = "false";

    node.addEventListener("click", () => handleCardClick(node, person));
    peopleGrid.appendChild(node);
  });
}

function handleCardClick(card, person) {
  /* First click → reveal the name & relation */
  if (card.dataset.revealed === "false") {
    card.dataset.revealed = "true";
    card.classList.add("is-revealed");

    const nameEl = card.querySelector(".person-name");
    const relEl = card.querySelector(".person-relation");

    /* Brief "flip" animation then swap content */
    card.classList.add("is-flipping");
    setTimeout(() => {
      nameEl.textContent = person.name;
      relEl.textContent = person.relation;
      card.classList.remove("is-flipping");
    }, 300);

    burstConfetti(18);
    return;
  }

  /* Second click → open the video modal */
  openModal(person);
}

function openModal(person) {
  modalName.textContent = person.name;
  modalVideo.src = person.video;
  modalNote.textContent = person.note || `${person.name} sent this just for you.`;
  modalVideo.onerror = () => {
    modalNote.textContent = `Video not added yet. Put it at ${person.video}, then refresh the page.`;
  };
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


loadPeople().then(renderPeople);
