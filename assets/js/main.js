// Where the contact form sends messages (opens the visitor's email client).
const CONTACT_EMAIL = "";

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Header state + mobile menu
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const setMenu = (open) => {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Dynamic year values
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll("[data-years-since]").forEach((el) => {
  el.textContent = `${new Date().getFullYear() - Number(el.dataset.yearsSince)}+`;
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Typed code in the hero
const codeSegments = [
  ["c", "// Your idea, shipped.\n"],
  ["k", "import"], ["", " { team } "], ["k", "from"], ["s", " \"@simple-code/solutions\""], ["", ";\n\n"],
  ["k", "const"], ["", " project = "], ["k", "await"], ["", " team."], ["f", "build"], ["", "({\n"],
  ["", "  goal: "], ["s", "\"your product\""], ["", ",\n"],
  ["", "  stack: ["], ["s", "\"React\""], ["", ", "], ["s", "\"TypeScript\""], ["", ", "], ["s", "\"Node\""], ["", ", "], ["s", "\"AWS\""], ["", "],\n"],
  ["", "  quality: "], ["t", "tested"], ["", ",\n"],
  ["", "  sprints: "], ["n", "2"], ["", ",\n"],
  ["", "});\n\n"],
  ["k", "await"], ["", " project."], ["f", "deploy"], ["", "("], ["s", "\"production\""], ["", ");\n"],
  ["c", "// ✓ Simple. Reliable. Delivered."],
];

const codeEl = document.getElementById("typed-code");
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const render = (count) => {
  let html = "";
  let left = count;
  for (const [cls, text] of codeSegments) {
    if (left <= 0) break;
    const part = escapeHtml(text.slice(0, left));
    left -= text.length;
    html += cls ? `<span class="${cls}">${part}</span>` : part;
  }
  codeEl.innerHTML = html;
};
const fullCode = codeSegments.map(([, t]) => t).join("");
const total = fullCode.length;

if (reduceMotion) {
  render(total);
} else {
  let i = 0;
  const tick = () => {
    i += 1;
    render(i);
    if (i < total) setTimeout(tick, fullCode[i - 1] === "\n" ? 120 : 22);
  };
  setTimeout(tick, 400);
}

// Contact form → email client
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  ["name", "email", "message"].forEach((id) => {
    const input = form.elements[id];
    const ok = input.value.trim() !== "" && (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    input.closest(".field").classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    note.textContent = "Please fill in your name, a valid email and a short message.";
    return;
  }
  if (!CONTACT_EMAIL) {
    note.textContent = "Our contact inbox is being set up. Please check back soon.";
    return;
  }

  const { name, email, type, message } = form.elements;
  const subject = `${type.value} enquiry from ${name.value.trim()}`;
  const body = `${message.value.trim()}\n\n—\n${name.value.trim()}\n${email.value.trim()}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Your email client should open with the message ready to send.";
});
