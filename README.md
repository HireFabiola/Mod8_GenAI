Flashcards Study App

A browser-based Flashcards Study App built with HTML, CSS, and JavaScript. This project focuses on interactive studying through flashcards and a matching game, while leveraging AI-assisted development to accelerate implementation.

Overview
This app allows users to study predefined flashcards covering HTML and JavaScript concepts. It includes two interactive modes:
Flashcards mode for flipping and reviewing terms
Matching mode for pairing terms with definitions

The project was developed using AI coding assistance (GitHub Copilot) to rapidly scaffold features, while carefully reviewing and refining generated code for correctness, accessibility, and performance.

Features
Flashcards Mode-
Flip cards to reveal term/definition
Navigate through cards (Next / Previous)
Shuffle card order
Preview next card
Toggle starting side (term or definition)
Optional hint display
Matching Mode-
Match terms with their definitions
Tracks completed matches
Provides feedback for correct/incorrect selections
Displays completed pairs
Filtering-
Filter cards by:
All
HTML concepts
JavaScript concepts

Animations
Smooth card flip animation
Transition animations for:
Next / Previous navigation
Shuffle interactions
Accessibility
Keyboard support:
Enter / Space to flip cards
ARIA attributes for interactive elements
Focus-aware interactions

Tech Stack
HTML5
CSS3 (animations, responsive layout)
Vanilla JavaScript (ES6+)
GitHub Copilot (AI-assisted development)

No frameworks or build tools are used.

Project Structure
flashcards-app/
│
├── index.html      # Layout and structure
├── styles.css      # Styling and animations
├── app.js          # Application logic and state
Data Model

The app uses a predefined dataset of flashcards:

Each card contains:
term
definition

Cards are categorized dynamically into:

HTML topics
JavaScript topics
How It Works
Flashcard Queue System
Cards are managed as a queue (reviewFlashcards)
Navigation rotates the queue:
Next → moves first card to end
Previous → moves last card to front
Matching Game Logic
Randomly selects a subset of cards
Separates terms and definitions
Tracks:
Selected pair
Completed matches
Validates matches based on shared ID
Filtering
Filters cards before rendering
Does not modify original dataset
Rebuilds the review queue on change
Getting Started

Clone the repository:

git clone https://github.com/your-username/flashcards-app.git

Open the project folder:

cd flashcards-app
Open index.html in your browser.

No installation required.

Usage
Select a mode:
Flashcards
Matching
Use controls to:
Flip cards
Navigate (Next / Previous)
Shuffle deck
Apply filters to focus on specific topics
In Matching mode:
Click a term and its matching definition

Reflection
Where AI saved time
AI significantly accelerated development by generating a large amount of functional code in a very short time. Even though the output initially contained bugs and inconsistencies, it provided a strong starting point that would have taken considerably longer to build from scratch. This allowed me to focus more on debugging and refining rather than initial implementation.
AI bug identified and how it was fixed
One issue involved a styling element where the AI did not correctly implement the placement and length of a visual line despite multiple prompts. I resolved this by asking the AI to identify the specific lines of code responsible and to add comments explaining each part, which allowed me to manually adjust the relevant variables.
A more complex issue occurred in the next function, where an extra step in the animation logic caused a third card to briefly appear, resulting in a glitchy transition. Debugging this required multiple iterations of prompting, with increasingly precise instructions. After several refinements in how I described the problem, the AI was eventually able to identify and correct the flaw. This process highlighted the importance of clear, incremental guidance when working with AI-generated code.
Code refactoring for clarity
While I did not directly refactor large portions of the code, working with AI-generated output made it clear how easily code can become overwhelming without intentional structure. The experience emphasized the importance of breaking logic into smaller, readable functions and adding comments to improve maintainability.
Accessibility improvement added
I used AI to enhance accessibility by improving navigation semantics and button descriptions. This included adding role="navigation" and aria-label="Flashcard deck navigation" to the controls container, as well as descriptive aria-label attributes for buttons such as:
“Show previous flashcard”
“Shuffle flashcards”
“Show next flashcard”
These changes improved usability for screen reader users and aligned the app more closely with accessibility best practices.
Prompt improvements that enhanced AI output
The quality of AI-generated code improved as I refined my prompts to be more specific and structured. Instead of broad requests, I found that breaking problems into smaller, clearly defined tasks and explicitly describing expected behavior led to more accurate and useful results. Iterative prompting and adjusting wording played a key role in guiding the AI toward correct solutions.