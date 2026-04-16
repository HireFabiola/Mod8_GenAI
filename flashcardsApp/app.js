const flashcards = [
  {
    term: "HTML",
    definition: "The markup language used to structure content on the web.",
  },
  {
    term: "element",
    definition: "A building block in HTML made of a start tag, content, and end tag.",
  },
  {
    term: "attribute",
    definition: "Additional information on an HTML tag, like src, href, or class.",
  },
  {
    term: "semantic element",
    definition: "An HTML tag that conveys meaning, such as <header>, <footer>, or <article>.",
  },
  {
    term: "<div>",
    definition: "A generic block container often used for layout in HTML.",
  },
  {
    term: "<span>",
    definition: "An inline container element used for styling part of text.",
  },
  {
    term: "<a>",
    definition: "An anchor element used to create hyperlinks to other pages or sections.",
  },
  {
    term: "<img>",
    definition: "An HTML element used to embed images in a page.",
  },
  {
    term: "<form>",
    definition: "An HTML container for collecting user input and submitting data.",
  },
  {
    term: "<section>",
    definition: "A thematic grouping element used to divide a page into sections.",
  },
  {
    term: "variable",
    definition: "A named storage location for data in JavaScript.",
  },
  {
    term: "function",
    definition: "A reusable block of code that can be called with arguments.",
  },
  {
    term: "array",
    definition: "An ordered list of values stored in a single JavaScript variable.",
  },
  {
    term: "object",
    definition: "A collection of key-value pairs used to store structured data.",
  },
  {
    term: "callback",
    definition: "A function passed as an argument to be executed later.",
  },
  {
    term: "promise",
    definition: "An object that represents the eventual completion or failure of async work.",
  },
  {
    term: "async/await",
    definition: "Syntax for handling promises in a more readable, synchronous style.",
  },
  {
    term: "DOM",
    definition: "The Document Object Model representing page structure that JavaScript can manipulate.",
  },
  {
    term: "event listener",
    definition: "A function that waits for and responds to user or browser events.",
  },
  {
    term: "closure",
    definition: "A function that remembers the scope in which it was created.",
  },
];

let currentIndex = 0;
const flashcardEl = document.getElementById("flashcard");
const cardWordEl = document.querySelector(".card-word");
const cardDefinitionEl = document.querySelector(".card-definition");
const hintTextEl = document.querySelector(".hint-text");
const showHintBtn = document.getElementById("show-hint");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function renderFlashcard() {
  const card = flashcards[currentIndex];
  cardDefinitionEl.textContent = card.definition;
  cardWordEl.textContent = card.term;
  hintTextEl.textContent = `Hint: starts with '${card.term.charAt(0)}' and has ${card.term.length} ${card.term.length === 1 ? "character" : "characters"}.`;
  hintTextEl.classList.add("hidden");
  flashcardEl.classList.remove("is-flipped");
  flashcardEl.setAttribute("aria-pressed", "false");
}

function flipCard() {
  const isFlipped = flashcardEl.classList.toggle("is-flipped");
  flashcardEl.setAttribute("aria-pressed", String(isFlipped));
}

flashcardEl.addEventListener("click", () => {
  flipCard();
});

showHintBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  hintTextEl.classList.toggle("hidden");
});

flashcardEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flipCard();
  }
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
