
let currentFilter = "All";
let trendingIndex = 0;
let trendingTimer = null;
let toastTimer = null;
let previousScreen = "home";

function showScreen(screenName) {

  clearInterval(trendingTimer);

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenName + "Screen");

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.screen === screenName
    );
  });

  if (screenName === "home") {
    startTrendingSlider();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openCategory(category) {

  currentFilter = category;

  document.querySelectorAll(".filter-chip").forEach(button => {
    button.classList.toggle(
      "active",
      button.textContent.trim() === category
    );
  });

  document.getElementById("templateSearch").value = "";

  renderTemplates();
  showScreen("explore");
}

function setFilter(category, button) {

  currentFilter = category;

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.remove("active");
  });

  button.classList.add("active");

  renderTemplates();
}

/* TRENDING SLIDER */

function renderTrending() {

  const track = document.getElementById("trendingTrack");
  const dots = document.getElementById("sliderDots");

  const trendingTemplates = TemplateEngine.getTrending();

  track.innerHTML = trendingTemplates.map(template => `

    <button class="trending-card"
      onclick="openTemplate('${template.id}')">

      <img src="${template.image}" alt="${template.title}">

      <div class="trending-content">
        <small>TRENDING</small>
        <h3>${template.title}</h3>
        <p>${template.category} · View template →</p>
      </div>

    </button>

  `).join("");

  dots.innerHTML = trendingTemplates.map((template, index) => `

    <span class="slider-dot ${index === 0 ? "active" : ""}"
      data-dot="${index}">
    </span>

  `).join("");

  trendingIndex = 0;

  updateTrendingPosition();
}

function updateTrendingPosition() {

  const track = document.getElementById("trendingTrack");
  const dots = document.querySelectorAll(".slider-dot");

  if (!track.children.length) return;

  trendingIndex =
    (trendingIndex + track.children.length) % track.children.length;

  track.style.transform =
    `translateX(-${trendingIndex * 100}%)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === trendingIndex
    );
  });
}

function moveTrending(direction) {

  const track = document.getElementById("trendingTrack");

  if (!track.children.length) return;

  trendingIndex += direction;

  updateTrendingPosition();

  startTrendingSlider();
}

function startTrendingSlider() {

  clearInterval(trendingTimer);

  trendingTimer = setInterval(() => {

    if (
      document.getElementById("homeScreen")
        .classList.contains("active")
    ) {
      trendingIndex++;
      updateTrendingPosition();
    }

  }, 2000);
}

/* TEMPLATE SEARCH AND FILTER */

function renderTemplates() {

  const searchInput = document.getElementById("templateSearch");
  const grid = document.getElementById("templateGrid");
  const resultCount = document.getElementById("resultCount");

  const results = TemplateEngine.search(
    searchInput.value,
    currentFilter
  );

  resultCount.textContent = results.length + " templates";

  if (!results.length) {

    grid.innerHTML = `
      <div class="no-results">
        No templates found. Try another search.
      </div>
    `;

    return;
  }

  grid.innerHTML = results.map(template => `

    <button class="template-card"
      onclick="openTemplate('${template.id}')">

      <div class="template-image">

        <img src="${template.image}" alt="${template.title}">

        <span class="template-category">
          ${template.category}
        </span>

      </div>

      <div class="template-details">

        <h4>${template.title}</h4>

        <p>${template.description}</p>

        <div class="template-open">
          <span>View template</span>
          <span>→</span>
        </div>

      </div>

    </button>

  `).join("");
}

/* OPEN TEMPLATE */

function openTemplate(id) {

  const template = TemplateEngine.getById(id);

  if (!template) {
    showToast("Template not found");
    return;
  }

  previousScreen = document.getElementById("exploreScreen")
    .classList.contains("active") ? "explore" : "home";

  document.getElementById("templateDetail").innerHTML = `

    <div class="detail-cover">
      <img src="${template.image}" alt="${template.title}">
    </div>

    <div class="detail-body">

      <span class="detail-tag">
        ${template.category}
      </span>

      <h2>${template.title}</h2>

      <p>${template.description}</p>

      <button class="detail-action"
        onclick="startCustomization('${template.id}')">

        Customize this template →

      </button>

    </div>

  `;

  clearInterval(trendingTimer);

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("detailScreen").classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function goBackFromDetail() {
  showScreen(previousScreen);
}

/* CUSTOMIZATION */

function startCustomization(id) {

  const template = TemplateEngine.getById(id);

  if (!template) return;

  showToast("Customization engine will be added in the next phase.");
}

/* MESSAGES */

function showComingSoon(name) {
  showToast(name + " will be available in a future phase.");
}

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

/* INITIALIZE */

document.addEventListener("DOMContentLoaded", () => {

  renderTrending();
  renderTemplates();
  startTrendingSlider();

});
