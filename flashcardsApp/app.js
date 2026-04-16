const flashcards = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What color do you get when you mix red and blue?", answer: "Purple" },
];

let currentIndex = 0;

const questionEl = document.querySelector(".question");
const answerEl = document.querySelector(".answer");
const showAnswerBtn = document.getElementById("show-answer");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function renderFlashcard() {
  const card = flashcards[currentIndex];
  questionEl.textContent = card.question;
  answerEl.textContent = card.answer;
  answerEl.classList.add("hidden");
  showAnswerBtn.textContent = "Show Answer";
}

showAnswerBtn.addEventListener("click", () => {
  const isHidden = answerEl.classList.toggle("hidden");
  showAnswerBtn.textContent = isHidden ? "Show Answer" : "Hide Answer";
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  renderFlashcard();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % flashcards.length;
  renderFlashcard();
});

renderFlashcard();
