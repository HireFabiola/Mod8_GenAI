// Flashcard data. This is the deck of cards the app will show.
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

// Index tracking is no longer used for the current card once we treat reviewFlashcards as a queue.
let currentIndex = 0;

// DOM references for the main card, preview card, and other interface elements.
const flashcardEl = document.getElementById("flashcard");
const previewCardEl = document.getElementById("preview-card");
const cardWordEl = document.querySelector("#flashcard .card-word");
const cardDefinitionEl = document.querySelector("#flashcard .card-definition");
const previewWordEl = document.querySelector("#preview-card .card-word");
const previewDefinitionEl = document.querySelector("#preview-card .card-definition");
const hintTextEl = document.querySelector(".hint-text");
const showHintBtn = document.getElementById("show-hint");
const gameModeButtons = document.querySelectorAll(".game-mode");
const gameModeNote = document.querySelector(".game-mode-note");
const matchingBoardEl = document.querySelector(".matching-mode");
const termsListEl = document.querySelector(".terms-list");
const defsListEl = document.querySelector(".defs-list");
const completionListEl = document.querySelector(".completion-list");
const flashcardFilterEl = document.querySelector(".flashcard-filter");
const reviewFilterEl = document.getElementById("review-filter");
const flipStartControlEl = document.querySelector(".flip-start-control");
const flipStartSelect = document.getElementById("flip-start");
const controlsEl = document.querySelector(".controls");
const cardDeckEl = document.querySelector(".card-deck");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// Track the currently selected mode and active review category.
let activeMode = "flashcards";
let activeReviewCategory = "all";
let deckStartSide = "definition";

// This is the current queue of cards shown to the user.
let reviewFlashcards = flashcards.slice();

// Update the header text to show the currently selected mode.
function updateGameModeText(mode) {
  const label = mode === "flashcards" ? "Flash Cards" : "Matching";
  gameModeNote.textContent = `Current mode: ${label}`;
}

// Set the active mode button, hide/show sections, and initialize content.
function setActiveMode(mode) {
  activeMode = mode;

  gameModeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateGameModeText(mode);
  updateModeVisibility();

  if (mode === "flashcards") {
    updateReviewFlashcards();
    renderFlashcard();
  }

  if (mode === "matching") {
    initMatchingGame();
  }
}

// Fill the preview card with the card at the given queue position.
function renderPreviewCard(index) {
  const card = reviewFlashcards[index] || { term: "", definition: "" };
  const showTermFirst = deckStartSide === "term";
  const previewFront = previewCardEl.querySelector(".card-front");
  const previewBack = previewCardEl.querySelector(".card-back");
  const previewFrontLabel = previewCardEl.querySelector(".card-front .card-label");
  const previewBackLabel = previewCardEl.querySelector(".card-back .card-label");

  previewFront.classList.toggle("term-side", showTermFirst);
  previewFront.classList.toggle("definition-side", !showTermFirst);
  previewBack.classList.toggle("definition-side", showTermFirst);
  previewBack.classList.toggle("term-side", !showTermFirst);

  if (showTermFirst) {
    previewFrontLabel.textContent = "";
    previewBackLabel.textContent = "Definition";
    previewDefinitionEl.textContent = "";
    previewWordEl.textContent = card.definition;
  } else {
    previewFrontLabel.textContent = "Definition";
    previewBackLabel.textContent = "Term";
    previewDefinitionEl.textContent = card.definition;
    previewWordEl.textContent = card.term;
  }
}

// Matching game state stored separately from flashcard review state.
const matchingState = {
  cardIds: [],
  termOrder: [],
  defOrder: [],
  completed: [],
  selected: null,
};

function getMatchingCardIds() {
  const htmlTerms = [
    "HTML",
    "element",
    "attribute",
    "semantic element",
    "<div>",
    "<span>",
    "<a>",
    "<img>",
    "<form>",
    "<section>",
  ];

  return flashcards.reduce((ids, card, index) => {
    if (activeReviewCategory === "all") {
      ids.push(index);
      return ids;
    }

    const isHtml = htmlTerms.includes(card.term);
    if (activeReviewCategory === "html" && isHtml) {
      ids.push(index);
    }
    if (activeReviewCategory === "javascript" && !isHtml) {
      ids.push(index);
    }
    return ids;
  }, []);
}

// Utility to shuffle an array without mutating the original.
function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

// Apply the selected review filter to the flashcard deck.
function updateReviewFlashcards() {
  const htmlTerms = [
    "HTML",
    "element",
    "attribute",
    "semantic element",
    "<div>",
    "<span>",
    "<a>",
    "<img>",
    "<form>",
    "<section>",
  ];

  reviewFlashcards = flashcards.filter((card) => {
    if (activeReviewCategory === "all") return true;
    if (activeReviewCategory === "html") return htmlTerms.includes(card.term);
    return !htmlTerms.includes(card.term);
  });

  // Reset the visible queue position after applying a filter.
  currentIndex = 0;
}

// Show or hide the flashcard or matching UI based on the current mode.
function updateModeVisibility() {
  const isMatching = activeMode === "matching";
  const isFlashcards = activeMode === "flashcards";

  cardDeckEl.classList.toggle("hidden", isMatching);
  controlsEl.classList.toggle("hidden", isMatching);
  matchingBoardEl.classList.toggle("hidden", !isMatching);
  flashcardFilterEl.classList.toggle("hidden", false);
  flipStartControlEl.classList.toggle("hidden", isMatching);
}

// Render the current flashcard and the preview of the next card.
function renderFlashcard() {
  if (reviewFlashcards.length === 0) {
    cardDefinitionEl.textContent = "No cards available for this review mode.";
    cardWordEl.textContent = "";
    previewDefinitionEl.textContent = "";
    previewWordEl.textContent = "";
    return;
  }

  const card = reviewFlashcards[0];
  const showTermFirst = deckStartSide === "term";

  const frontFace = flashcardEl.querySelector(".card-front");
  const backFace = flashcardEl.querySelector(".card-back");
  const frontLabel = flashcardEl.querySelector(".card-front .card-label");
  const backLabel = flashcardEl.querySelector(".card-back .card-label");
  const footnote = flashcardEl.querySelector(".card-footnote");

  frontFace.classList.toggle("term-side", showTermFirst);
  frontFace.classList.toggle("definition-side", !showTermFirst);
  backFace.classList.toggle("definition-side", showTermFirst);
  backFace.classList.toggle("term-side", !showTermFirst);

  if (showTermFirst) {
    frontLabel.textContent = "";
    backLabel.textContent = "Definition";
    cardDefinitionEl.textContent = card.term;
    cardWordEl.textContent = card.definition;
    footnote.textContent = "";
    showHintBtn.classList.remove("hidden");
    hintTextEl.classList.add("hidden");
  } else {
    frontLabel.textContent = "Definition";
    backLabel.textContent = "Term";
    cardDefinitionEl.textContent = card.definition;
    cardWordEl.textContent = card.term;
    footnote.textContent = "Click to flip for term";
    showHintBtn.classList.remove("hidden");
  }

  if (reviewFlashcards.length > 1) {
    renderPreviewCard(1);
  } else {
    previewDefinitionEl.textContent = "";
    previewWordEl.textContent = "";
  }

  flashcardEl.classList.remove("is-flipped");
  flashcardEl.setAttribute("aria-pressed", "false");
}

// Create one of the term/definition match buttons used in matching mode.
function createMatchButton(type, id, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `match-card ${type}-card`;
  button.dataset.type = type;
  button.dataset.id = id;
  button.textContent = label;
  button.addEventListener("click", () => handleMatchSelect(type, id));
  return button;
}

// Display a message in the matching game area.
function setMatchMessage(message, type = "info") {
  const messageEl = document.querySelector(".match-message");
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.classList.toggle("success", type === "success");
  messageEl.classList.toggle("error", type === "error");
}

// Render completed match list items.
function renderCompletionDeck() {
  completionListEl.innerHTML = "";

  if (matchingState.completed.length === 0) {
    completionListEl.innerHTML = "<p>No completed pairs yet.</p>";
    return;
  }

  matchingState.completed.forEach((id) => {
    const item = document.createElement("div");
    item.className = "completion-card";
    item.textContent = `${flashcards[id].term} — ${flashcards[id].definition}`;
    completionListEl.appendChild(item);
  });
}

// Render term buttons and definition buttons for matching mode.
function renderMatchingCards() {
  termsListEl.innerHTML = "";
  defsListEl.innerHTML = "";

  matchingState.termOrder.forEach((id) => {
    if (!matchingState.completed.includes(id)) {
      termsListEl.appendChild(createMatchButton("term", id, flashcards[id].term));
    }
  });

  matchingState.defOrder.forEach((id) => {
    if (!matchingState.completed.includes(id)) {
      defsListEl.appendChild(createMatchButton("definition", id, flashcards[id].definition));
    }
  });
}

// Clear any temporarily selected match buttons.
function clearMatchSelection() {
  matchingState.selected = null;
  document.querySelectorAll(".match-card").forEach((button) => {
    button.classList.remove("selected");
  });
}

// Handle a match button being clicked.
function handleMatchSelect(type, id) {
  if (matchingState.completed.includes(id)) {
    return;
  }

  const selected = matchingState.selected;

  if (!selected || selected.type === type) {
    // First selection: clear old highlights, store the new choice, and mark it.
    clearMatchSelection();
    matchingState.selected = { type, id };
    setMatchMessage(`Selected ${type === "term" ? "term" : "definition"}. Now choose the matching ${type === "term" ? "definition" : "term"}.`, "info");
    const button = document.querySelector(`.match-card[data-type="${type}"][data-id="${id}"]`);
    if (button) button.classList.add("selected");
    return;
  }

  if (selected.id === id) {
    // Correct match: move the pair to the completed list.
    matchingState.completed.push(id);
    setMatchMessage("Great job! Correct pair moved to the completion deck.", "success");
    clearMatchSelection();
    renderMatchingCards();
    renderCompletionDeck();
    return;
  }

  // Incorrect match: reset selection and show an error.
  setMatchMessage("Not a match yet. Try again — you’re close!", "error");
  clearMatchSelection();
}

// Initialize matching mode state and render it.
function initMatchingGame() {
  const availableIds = shuffleArray(getMatchingCardIds());
  const selectedIds = availableIds.slice(0, 10);
  matchingState.cardIds = selectedIds;
  matchingState.termOrder = shuffleArray(selectedIds);
  matchingState.defOrder = shuffleArray(selectedIds);
  matchingState.completed = [];
  matchingState.selected = null;
  setMatchMessage("Select one term and one definition to match.", "info");
  renderMatchingCards();
  renderCompletionDeck();
}

// Flip the current flashcard to show the back side.
function flipCard() {
  const isFlipped = flashcardEl.classList.toggle("is-flipped");
  flashcardEl.setAttribute("aria-pressed", String(isFlipped));
}

// Main click handler for card flipping.
flashcardEl.addEventListener("click", () => {
  flipCard();
});

// Toggle the hint text when hint button is clicked.
showHintBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  hintTextEl.classList.toggle("hidden");
});

// Allow mode buttons to switch the current view.
gameModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveMode(button.dataset.mode);
  });
});

// Update the displayed review cards when the filter changes.
reviewFilterEl.addEventListener("change", () => {
  activeReviewCategory = reviewFilterEl.value;
  updateReviewFlashcards();

  if (activeMode === "matching") {
    initMatchingGame();
    return;
  }

  renderFlashcard();
});

flipStartSelect.addEventListener("change", () => {
  deckStartSide = flipStartSelect.value;
  cardDeckEl.classList.remove("reshuffle");
  void cardDeckEl.offsetWidth;
  cardDeckEl.classList.add("reshuffle");
  renderFlashcard();
});

cardDeckEl.addEventListener("animationend", (event) => {
  if (event.animationName === "reshuffle") {
    cardDeckEl.classList.remove("reshuffle");
  }
});

// Support keyboard flipping of the card.
flashcardEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flipCard();
  }
});

// Prevent interactions during the move animation.
let isTransitioning = false;

// Helper to animate the current card using a clone while keeping the real card hidden.
function animateCardTransition(animationClass, onComplete) {
  const clone = flashcardEl.cloneNode(true);
  clone.removeAttribute("id");
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.width = "100%";
  clone.style.maxWidth = "520px";
  clone.style.zIndex = "4";
  clone.style.pointerEvents = "none";
  clone.classList.add("animated-copy", animationClass);

  flashcardEl.style.visibility = "hidden";
  cardDeckEl.appendChild(clone);

  const onAnimationEnd = (event) => {
    if (event.animationName !== (animationClass === "move-to-back" ? "moveBack" : "moveFront")) return;
    clone.removeEventListener("animationend", onAnimationEnd);
    cardDeckEl.removeChild(clone);
    flashcardEl.style.visibility = "visible";
    onComplete();
  };

  clone.addEventListener("animationend", onAnimationEnd);
}

// Previous button moves the last card in the queue to the front.
prevBtn.addEventListener("click", () => {
  if (isTransitioning) return;
  if (reviewFlashcards.length < 2) return;
  isTransitioning = true;

  flashcardEl.classList.remove("is-flipped");
  flashcardEl.setAttribute("aria-pressed", "false");
  hintTextEl.classList.add("hidden");

  // Preview the previous card while current card animates forward.
  renderPreviewCard(reviewFlashcards.length - 1);

  animateCardTransition("move-to-front", () => {
    const lastCard = reviewFlashcards.pop();
    reviewFlashcards.unshift(lastCard);
    renderFlashcard();
    isTransitioning = false;
  });
});

// Next button animates the top card to the back and makes the preview card current.
nextBtn.addEventListener("click", () => {
  if (isTransitioning) return;
  if (reviewFlashcards.length < 2) return;
  isTransitioning = true;

  flashcardEl.classList.remove("is-flipped");
  flashcardEl.setAttribute("aria-pressed", "false");
  hintTextEl.classList.add("hidden");

  // Preview the next card while the current card animates away.
  renderPreviewCard(1);

  animateCardTransition("move-to-back", () => {
    const firstCard = reviewFlashcards.shift();
    reviewFlashcards.push(firstCard);
    renderFlashcard();
    isTransitioning = false;
  });
});

// Initial render of the first card.
renderFlashcard();
