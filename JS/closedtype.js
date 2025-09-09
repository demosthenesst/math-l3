// ===== State & storage =====
const savedData = JSON.parse(localStorage.getItem("quizData")) || {
  score: 0,
  answers: {},
};
let score = savedData.score;
const scoreDisplay = document.getElementById("score");
const resetBtn = document.getElementById("reset");
const progressList = document.getElementById("progressList");
const progressBar = document.getElementById("progressBar");
const toggleReviewBtn = document.getElementById("toggleReview");
const progressTracker = document.querySelector("#progress-tracker");
const progressTrackerBtn = document.getElementById("progressTrackerShow");
const toggleTrackerView = document.getElementById("toggleTrackerView");
const closeBtn = document.getElementById("closeBtn");
const questionBlocks = document.querySelectorAll(".question-block");
//let showWrongOnly = false;
let showTrackerWrongOnly = false; //stays here
// score
const percentage = (100 * score) / questionBlocks.length;
const rating = Math.round(percentage * 100) / 100;
scoreDisplay.innerHTML = `${score}/${questionBlocks.length} &mdash; ${rating.toString().replace(".", ",")}%`;

// ===== Utils =====
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== Number questions visually =====
questionBlocks.forEach((block, index) => {
  block.dataset.id = `q${index + 1}`;
  //
  const span = document.createElement("span");
  span.className = "q-index";
  span.innerHTML = `ΕΡΩΤΗΣΗ ${index + 1}`;
  block.prepend(span);

  const feedback = document.createElement("p");
  feedback.className = "feedback";

  const options = block.querySelector(".options");
  block.insertBefore(feedback, options.nextSibling);
});

// ===== Progress bar =====
function updateProgressBar() {
  const total = questionBlocks.length;
  const answered = Object.keys(savedData.answers).length;
  progressBar.style.width = (answered / total) * 100 + "%";
}

// ===== Initialize each question =====
questionBlocks.forEach((block) => {
  const qid = block.dataset.id;
  const ul = block.querySelector(".options");
  const liArray = Array.from(ul.children);

  // Shuffle answers only
  shuffle(liArray);

  if (liArray.length != 2) {
    liArray.forEach((li) => ul.appendChild(li));
  }

  const buttons = block.querySelectorAll(".option-btn");
  const feedback = block.querySelector(".feedback");
  const explanation = block.querySelector(".explanation");

  // Restore from saved state
  if (savedData.answers[qid]) {
    const { correct, chosen } = savedData.answers[qid];
    buttons.forEach((b) => {
      if (b.textContent === chosen) b.classList.add(correct ? "correct" : "incorrect");
      if (b.dataset.correct === "true") b.classList.add("correct");
    });
    feedback.textContent = correct ? "Σωστή επιλογή!" : `Λανθασμένη επιλογή!`;
    feedback.className = correct ? "feedback correct" : "feedback incorrect";
    feedback.style.display = "block";

    if (!correct && explanation) explanation.style.display = "block";
  }

  // Handle selection
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (savedData.answers[qid]) return; // prevent re-answer

      let correct = false;
      if (btn.dataset.correct === "true") {
        btn.classList.add("correct");
        feedback.textContent = "Σωστή επιλογή!";
        feedback.className = "feedback correct";
        score++;
        correct = true;
      } else {
        btn.classList.add("incorrect");
        //const rightAnswer = [...buttons].find((b) => b.dataset.correct === "true").textContent;
        feedback.textContent = `Λάνθασμένη επιλογή!`;
        feedback.className = "feedback incorrect";
        [...buttons].find((b) => b.dataset.correct === "true").classList.add("correct");
        if (explanation) explanation.style.display = "block";
      }

      feedback.style.display = "block";

      const percentage = (100 * score) / questionBlocks.length;
      const rating = Math.round(percentage * 100) / 100;

      scoreDisplay.innerHTML = `${score}/${questionBlocks.length} &mdash; ${rating.toString().replace(".", ",")}%`;
      // Save
      savedData.score = score;
      savedData.answers[qid] = { correct, chosen: btn.innerHTML };
      localStorage.setItem("quizData", JSON.stringify(savedData));

      updateProgressBar();
      scoreAppearance(5000);
    });
  });
});

// ===== Initial UI state =====

updateProgressBar();

// ===== Reset =====
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("quizData");
  location.reload();
});

// ===== Review Mode (show wrong only) =====
let showWrongOnly = false;
//
const toggleProgress = () => {
  showWrongOnly = !showWrongOnly;
  toggleReviewBtn.innerHTML = showWrongOnly ? `<i class="fa-regular fa-eye"></i>` : `<i class="fa-regular fa-eye-slash"></i>`;
  questionBlocks.forEach((block) => {
    const qid = block.dataset.id;
    const ans = savedData.answers[qid];
    if (showWrongOnly) {
      if (ans && ans.correct) block.style.display = "none";
      else block.style.display = "block";
    } else {
      block.style.display = "block";
    }
  });
};

toggleReviewBtn.addEventListener("click", toggleProgress);

// ===== Progress Tracker btns =====

function updateTrackerList() {
  showTrackerWrongOnly = false;

  toggleTrackerView.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;

  progressList.innerHTML = "";

  questionBlocks.forEach((block, index) => {
    const question = block.querySelector(".question");
    const qid = block.dataset.id;
    const status = savedData.answers[qid];
    const text = question.innerHTML.trim();

    const li = document.createElement("li");

    li.innerHTML = `<span class="number-label">${index + 1})</span> <span class="progress-tracker-content">${text}</span>`;
    li.dataset.qid = qid;
    li.addEventListener("click", () => {
      progressTracker.style.display = "none";
      document.body.classList.remove("no-scroll");
      block.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (status) {
      const { correct, chosen } = savedData.answers[qid];

      const correctAnswer = [...block.querySelectorAll(".option-btn")].find((b) => b.dataset.correct === "true").innerHTML;

      const correctAnswer2 = correctAnswer == "Σωστό" ? "Σ" : correctAnswer == "Λάθος" ? "Λ" : correctAnswer;
      const chosenAnswer = status.chosen == "Σωστό" ? "Σ" : status.chosen == "Λάθος" ? "Λ" : status.chosen;
      //

      const content = correct
        ? `<div class="your-answer"><span>Η απάντηση σου: ${chosenAnswer}</span><i class="fa-solid fa-circle-check"></i></div>`
        : `<div class="your-answer"><span>Η απάντηση σου: ${chosenAnswer}</span><i class="fa-solid fa-circle-xmark"></i></div>
        <div class="correct-answer-text">Η σωστή απάντηση είναι:</div>
      <div class="correct-answer">${correctAnswer2}</div>`;

      li.innerHTML += content;

      li.className = correct ? "progress-correct" : "progress-incorrect";
    } else {
      li.className = "progress-unanswered";
    }

    progressList.appendChild(li);

    if (block.previousElementSibling.tagName === "H2") {
      liStr = `<li class="progress-tracker-label">${block.previousElementSibling.textContent}</li>`;
      li.insertAdjacentHTML("beforebegin", liStr);
    }
  });
}

const progressTrackerShow = () => {
  progressTracker.style.display = "block";
  document.body.classList.add("no-scroll");
  updateTrackerList();
};

progressTrackerBtn.addEventListener("click", progressTrackerShow);

const progressTrackerClose = () => {
  progressTracker.style.display = "none";
  document.body.classList.remove("no-scroll");
};

const progressEntries = progressList.querySelectorAll("li[data-qid]");
//
const toggleProgressTrackerView = () => {
  showTrackerWrongOnly = !showTrackerWrongOnly;
  toggleTrackerView.innerHTML = showTrackerWrongOnly ? `<i class="fa-regular fa-eye"></i>` : `<i class="fa-regular fa-eye-slash"></i>`;

  questionBlocks.forEach((block, index) => {
    const qid = block.dataset.id;
    const ans = savedData.answers[qid];
    //
    const listentry = progressList.querySelector(`[data-qid="${qid}"]`);

    if (showTrackerWrongOnly) {
      if (ans && ans.correct) {
        listentry.style.display = "none";
      } else {
        listentry.style.display = "grid";
      }
    } else {
      listentry.style.display = "grid";
    }
  });
};

toggleTrackerView.addEventListener("click", toggleProgressTrackerView);

closeBtn.addEventListener("click", progressTrackerClose);

// ===== Keyboard Shortcuts =====
document.addEventListener("keydown", (e) => {
  const visibleQuestions = Array.from(questionBlocks).filter((b) => b.style.display !== "none");
  for (const block of visibleQuestions) {
    const buttons = block.querySelectorAll(".option-btn");
    if (savedData.answers[block.dataset.id]) continue; // skip answered

    if (/^[1-9]$/.test(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (idx < buttons.length) buttons[idx].click();
      break;
    }
    if (e.key.toLowerCase() === "t" && buttons.length === 2) {
      buttons[0].click();
      break;
    }
    if (e.key.toLowerCase() === "f" && buttons.length === 2) {
      buttons[1].click();
      break;
    }
  }
});

//=============
// timers
//=============

const panel = document.getElementById("panel-container");
const scoreViewBtn = document.getElementById("scoreViewBtn");
let scrollTimeout;

const scoreAppearance = (msecs) => {
  panel.classList.add("visible");

  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    panel.classList.remove("visible");
  }, msecs);
};

scoreViewBtn.addEventListener("click", () => {
  scoreAppearance(3000);
});

//==============
// cardinalities
//=============

const sections = document.querySelectorAll('section');
const contentsAnchors = document.querySelectorAll('#contents a');

sections.forEach((section, index)=>{
  const secLength = section.querySelectorAll('.question-block').length
  const secLabel = section.querySelector('h2');
  secLabel.innerHTML +=` (${secLength})`;
  contentsAnchors[index].innerHTML +=` (${secLength})`;
})

//==============
// search
//=============

// Get exercises
const searchButton = document.querySelector('#search-container button');
const searchInput = document.querySelector('#search-container input');
const searchAnchor = document.querySelector('#search-anchor')

function jumpToExercise() {
  const number = parseInt(searchInput.value, 10);

  if (isNaN(number) || number < 1 || number > questionBlocks.length) {
    alert("Εισάγετε έγκυρο αριθμό άσκησης (1-" + questionBlocks.length + ")");
    return;
  }

  const target = questionBlocks[number - 1];
  //target.scrollIntoView({ behavior: "smooth", block: "start" });
target.scrollIntoView();
  target.classList.add("highlight");
  setTimeout(() => target.classList.remove("highlight"), 2000);

  searchInput.value = "";
  searchInput.blur();
}

// Click event
searchButton.addEventListener("click", jumpToExercise);

// Enter key event
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    jumpToExercise();
  }
});

searchAnchor.addEventListener("click", () => {
  if (searchInput) {
    setTimeout(() => {
      searchInput.focus();
    }, 0);
  }
});

