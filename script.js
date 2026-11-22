const messages = [
  {
    id: "thanks",
    title: "Terima Kasih, Bu Eka",
    paragraphs: [
      "Terima kasih atas perhatian, kesabaran, dan kebaikan Ibu selama membimbing saya dan anak-anak pplg, meskipun ibu merasa kurang dalam memberikan ilmu, itu tetap berarti buat saya.",
      "Hal-hal sederhana yang Ibu lakukan mungkin terlihat biasa, tetapi bisa memberi arti besar bagi kami."
    ]
  },
  {
    id: "lesson",
    title: "Sebuah Pelajaran",
    paragraphs: [
      "Dari Ibu, kami belajar bahwa menjadi seorang guru bukan hanya tentang menyampaikan materi, tetapi juga tentang memahami dan mengarahkan.",
      "Nasihat dan arahan Ibu akan menjadi bekal yang saya ingat dalam perjalanan ke depan."
    ]
  },
  {
    id: "memory",
    title: "Sebuah Kenangan",
    paragraphs: [
      "Setiap masa memiliki cerita. Ada proses, tawa, nasihat, dan pengalaman yang menjadi bagian dari perjalanan kami.",
      "Terima kasih sudah menjadi bagian dari cerita tersebut, Bu Eka."
    ]
  },
  {
    id: "wish",
    title: "Doa dan Harapan",
    paragraphs: [
      "Semoga Ibu selalu diberikan kesehatan, ketenangan, dan kekuatan dalam menjalankan setiap amanah.",
      "Semoga setiap ilmu dan kebaikan yang Ibu berikan menjadi hal bermanfaat yang terus mengalir. Selamat Hari Guru, Bu Eka."
    ]
  }
];

const messageGrid = document.getElementById("messageGrid");
const messageModal = document.getElementById("messageModal");
const modalContent = messageModal.querySelector(".modal-content");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const messageCounter = document.getElementById("messageCounter");
const closeModalButton = document.getElementById("closeModal");
const doneModalButton = document.getElementById("doneModal");
const prevMessageButton = document.getElementById("prevMessage");
const nextMessageButton = document.getElementById("nextMessage");
const openFirstMessageButton = document.getElementById("openFirstMessage");

let currentIndex = 0;
let lastTrigger = null;

function renderMessage(index) {
  const message = messages[index];
  if (!message) return;

  modalBody.classList.add("changing");
  modalTitle.textContent = message.title;
  messageCounter.textContent =
    `${String(index + 1).padStart(2, "0")} / ${String(messages.length).padStart(2, "0")}`;

  modalBody.replaceChildren();
  message.paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    modalBody.appendChild(p);
  });

  prevMessageButton.disabled = index === 0;
  nextMessageButton.disabled = index === messages.length - 1;

  requestAnimationFrame(() => modalBody.classList.remove("changing"));
}

function openMessage(index, trigger) {
  if (index < 0 || index >= messages.length) return;
  currentIndex = index;
  lastTrigger = trigger || null;
  renderMessage(currentIndex);
  messageModal.classList.add("is-open");
  messageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeModalButton.focus();
}

function closeMessage() {
  messageModal.classList.remove("is-open");
  messageModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastTrigger) lastTrigger.focus();
}

function changeMessage(direction) {
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= messages.length) return;
  currentIndex = nextIndex;
  renderMessage(currentIndex);
}

messageGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-message]");
  if (!card) return;
  const selectedIndex = messages.findIndex((message) => message.id === card.dataset.message);
  openMessage(selectedIndex, card);
});

openFirstMessageButton.addEventListener("click", () => {
  openMessage(0, openFirstMessageButton);
});
closeModalButton.addEventListener("click", closeMessage);
doneModalButton.addEventListener("click", closeMessage);
prevMessageButton.addEventListener("click", () => changeMessage(-1));
nextMessageButton.addEventListener("click", () => changeMessage(1));

messageModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) closeMessage();
});

document.addEventListener("keydown", (event) => {
  if (!messageModal.classList.contains("is-open")) return;

  if (event.key === "Escape") closeMessage();
  if (event.key === "ArrowRight") changeMessage(1);
  if (event.key === "ArrowLeft") changeMessage(-1);

  if (event.key === "Tab") {
    const focusable = [...modalContent.querySelectorAll("button:not(:disabled)")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
