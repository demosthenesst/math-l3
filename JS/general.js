// -----------------------------
// footer
// -----------------------------

const footer = document.createElement("footer");
const nav = document.createElement("nav");
//
const homeAnchor = document.createElement("a");
homeAnchor.href = "../main.html";
homeAnchor.innerHTML = '<i class="fa-solid fa-house"></i>';
//
const contentsAnchor = document.createElement("a");
contentsAnchor.href = "#contents-container";
contentsAnchor.innerHTML = '<i class="fa-solid fa-list-ul"></i>';
//
const searchAnchor = document.createElement("a");
searchAnchor.href = "#search-container";
searchAnchor.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
//
document.body.appendChild(footer);
footer.appendChild(nav);
nav.appendChild(searchAnchor);
nav.appendChild(contentsAnchor);
nav.appendChild(homeAnchor);

// -----------------------------
// search bar
// -----------------------------

const container = document.createElement("div");
container.id = "search-container";
//
const searchInput = document.createElement("input");
searchInput.type = "number";
searchInput.placeholder = "Εισάγετε αριθμό άσκησης...";
//
const button = document.createElement("button");
button.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
//
container.appendChild(searchInput);
container.appendChild(button);
document.body.prepend(container);

// Get exercises
const exercises = document.querySelectorAll(".exercise");

function jumpToExercise() {
  const number = parseInt(searchInput.value, 10);

  if (isNaN(number) || number < 1 || number > exercises.length) {
    alert("Εισάγετε έγκυρο αριθμό άσκησης (1-" + exercises.length + ")");
    return;
  }

  const target = exercises[number - 1];
  target.scrollIntoView({ behavior: "smooth", block: "center" });

  target.classList.add("highlight");
  setTimeout(() => target.classList.remove("highlight"), 2000);

  searchInput.value = "";
  searchInput.blur();
}

// Click event
button.addEventListener("click", jumpToExercise);

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

// -----------------------------
// exercise enumeration
// -----------------------------

exercises.forEach((el, idx) => {
  const label = document.createElement("h4");
  label.textContent = `ΑΣΚΗΣΗ ${idx + 1}`;
  //el.before(label);
  el.prepend(label);
});
