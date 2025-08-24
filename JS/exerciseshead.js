// head.js

// -----------------------------
// MathJax configuration
// -----------------------------
window.MathJax = {
  tex: {
    macros: {
      gsin: "\\operatorname{ημ}",
      gcos: "\\operatorname{συν}",
      gtan: "\\operatorname{εφ}",
      gctan: "\\operatorname{σφ}",
      dint: "\\displaystyle\\int",
    },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
};

// -----------------------------
// MathJax script
// -----------------------------
const mj = document.createElement("script");
mj.id = "MathJax-script";
mj.async = true;
mj.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
document.head.appendChild(mj);

// -----------------------------
// Google Fonts preconnect
// -----------------------------
const preconnect1 = document.createElement("link");
preconnect1.rel = "preconnect";
preconnect1.href = "https://fonts.googleapis.com";
document.head.appendChild(preconnect1);

const preconnect2 = document.createElement("link");
preconnect2.rel = "preconnect";
preconnect2.href = "https://fonts.gstatic.com";
preconnect2.crossOrigin = "anonymous";
document.head.appendChild(preconnect2);

// -----------------------------
// Google Fonts stylesheet
// -----------------------------
const googleFont = document.createElement("link");
googleFont.rel = "stylesheet";
googleFont.href =
  "https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap";
document.head.appendChild(googleFont);

// -----------------------------
// Font Awesome stylesheet
// -----------------------------
const fa = document.createElement("link");
fa.rel = "stylesheet";
fa.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
fa.integrity =
  "sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==";
fa.crossOrigin = "anonymous";
fa.referrerPolicy = "no-referrer";
document.head.appendChild(fa);

// -----------------------------
// Local CSS
// -----------------------------
const localCSS = document.createElement("link");
localCSS.rel = "stylesheet";
localCSS.type = "text/css";
localCSS.href = "../css/exercisesstyle.css";
document.head.appendChild(localCSS);

// -----------------------------
// CSS page colors
// -----------------------------

let currentFile = window.location.pathname.split("/").pop();
let currentPage = currentFile.replace(/\.html$/, "");
let html = document.documentElement;
let pageColors = {
  functions: "rgba(27, 94, 120, 1)",
  limits: "rgba(15, 56, 121, 1)",
  continuity: "rgba(18, 96, 106, 1)",
  derivative_1: "rgba(21, 67, 40, 1)",
  derivative_2: "rgba(83, 80, 2, 1)",
  integral: "rgba(53, 20, 84, 1)",
  followup: "rgba(4, 116, 84, 1)",
};

html.style.setProperty(
  "--theme-color",
  pageColors[currentPage] || "rgba(40, 80, 83, 1)"
);

html.style.setProperty(
  "--theme-color-tr",
  pageColors[currentPage].replace(", 1)", ", 0.2)") || "rgba(40, 80, 83, 1)"
);

//console.log(`CSS variable --theme-color set for page: ${currentPage}`);
