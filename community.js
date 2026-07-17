import {
  COMMUNITIES,
  COMMUNITY_TOPICS,
  filterCommunities,
} from "./community-catalog.js";
import { communityService } from "./community-service.js";

const filters = document.querySelector("#community-filters");
const grid = document.querySelector("#community-grid");
const empty = document.querySelector("#community-empty");
const count = document.querySelector("#community-result-count");
const searchForm = document.querySelector("#community-search-form");
const search = document.querySelector("#community-search");
const dialog = document.querySelector("#interest-dialog");
const interestForm = document.querySelector("#interest-form");
const topicOptions = document.querySelector("#interest-topic-options");
const topicError = document.querySelector("#interest-topic-error");
const interestStatus = document.querySelector("#interest-status");
const submitInterest = document.querySelector("#submit-interest");
const toast = document.querySelector("#community-toast");
const accountLink = document.querySelector(".nav-links .button");

const DRAFT_KEY = "dino-community-interest-draft";
let activeTopic = "Todas";

function escapeText(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function renderFilters() {
  filters.replaceChildren(
    ...["Todas", ...COMMUNITY_TOPICS].map((topic) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "directory-filter";
      button.textContent = topic;
      button.dataset.topic = topic;
      button.setAttribute("aria-pressed", String(topic === activeTopic));
      button.addEventListener("click", () => {
        activeTopic = topic;
        renderFilters();
        renderCommunities();
      });
      return button;
    }),
  );
}

function communityCard(community) {
  const article = document.createElement("article");
  article.className = "directory-card";
  article.innerHTML = `
    <a class="directory-card-media" href="${community.href}" aria-label="Conhecer ${escapeText(community.name)}">
      <img src="${community.image}" alt="${escapeText(community.imageAlt)}" width="1984" height="793" />
    </a>
    <div class="directory-card-body">
      <span class="directory-card-eyebrow">${escapeText(community.eyebrow)}</span>
      <h3><a href="${community.href}">${escapeText(community.name)}</a></h3>
      <p>${escapeText(community.description)}</p>
      <div class="directory-card-topics" aria-label="Assuntos">
        ${community.topics
          .slice(0, 3)
          .map((topic) => `<span>${escapeText(topic)}</span>`)
          .join("")}
      </div>
      <a class="directory-card-action" href="${community.href}">Conhecer o clube <span aria-hidden="true">→</span></a>
    </div>`;
  return article;
}

function renderCommunities() {
  const results = filterCommunities({
    query: search.value,
    topic: activeTopic,
  });
  grid.replaceChildren(...results.map(communityCard));
  grid.hidden = results.length === 0;
  empty.hidden = results.length !== 0;
  count.textContent = `${results.length} ${results.length === 1 ? "comunidade" : "comunidades"}`;
}

function renderTopicOptions() {
  topicOptions.replaceChildren(
    ...COMMUNITY_TOPICS.map((topic, index) => {
      const label = document.createElement("label");
      label.className = "interest-topic-option";
      label.innerHTML = `<input type="radio" name="topic" value="${topic}" ${index === 0 ? "checked" : ""}><span>${topic}</span>`;
      return label;
    }),
  );
}

function saveDraft() {
  sessionStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({
      name: interestForm.elements.name.value,
      purpose: interestForm.elements.purpose.value,
      topic: new FormData(interestForm).get("topic"),
    }),
  );
}

function restoreDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    if (!draft) return;
    interestForm.elements.name.value = draft.name || "";
    interestForm.elements.purpose.value = draft.purpose || "";
    const option = interestForm.querySelector(
      `input[name="topic"][value="${CSS.escape(draft.topic || "")}"]`,
    );
    if (option) option.checked = true;
  } catch {
    sessionStorage.removeItem(DRAFT_KEY);
  }
}

function openDialog() {
  interestStatus.textContent = "";
  restoreDraft();
  dialog.showModal();
  document.body.classList.add("dialog-open");
  setTimeout(() => interestForm.elements.name.focus(), 0);
}

function closeDialog() {
  dialog.close();
  document.body.classList.remove("dialog-open");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function validateInterest() {
  let valid = true;
  for (const field of [
    interestForm.elements.name,
    interestForm.elements.purpose,
  ]) {
    const error = field.parentElement.querySelector(".field-error");
    error.textContent = field.value.trim() ? "" : "Preencha este campo.";
    if (!field.value.trim()) valid = false;
  }
  const topic = new FormData(interestForm).get("topic");
  topicError.textContent = topic ? "" : "Escolha um assunto.";
  return valid && Boolean(topic);
}

searchForm.addEventListener("submit", (event) => event.preventDefault());
search.addEventListener("input", renderCommunities);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !dialog.open && !/INPUT|TEXTAREA/.test(event.target.tagName)) {
    event.preventDefault();
    search.focus();
  }
});

document.querySelectorAll("#open-interest, [data-open-interest]").forEach((button) =>
  button.addEventListener("click", openDialog),
);
document.querySelector("#close-interest").addEventListener("click", closeDialog);
document.querySelector("#cancel-interest").addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

interestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateInterest()) return;

  const data = new FormData(interestForm);
  const payload = {
    name: data.get("name").trim(),
    purpose: data.get("purpose").trim(),
    topic: data.get("topic"),
  };
  const user = await communityService.currentUser();
  if (!user) {
    saveDraft();
    const next = encodeURIComponent("/community?create=1");
    location.href = `/login?next=${next}`;
    return;
  }

  submitInterest.disabled = true;
  submitInterest.textContent = "Registrando…";
  interestStatus.textContent = "";
  try {
    await communityService.requestCommunity(payload);
    sessionStorage.removeItem(DRAFT_KEY);
    interestForm.reset();
    closeDialog();
    showToast("Interesse registrado. O Dino vai guardar essa ideia.");
  } catch (error) {
    interestStatus.textContent = error.message;
  } finally {
    submitInterest.disabled = false;
    submitInterest.textContent = "Entrar na lista →";
  }
});

renderTopicOptions();
renderFilters();
renderCommunities();

if (await communityService.currentUser()) {
  accountLink.href = "/profile";
  accountLink.textContent = "Perfil →";
}

const params = new URLSearchParams(location.search);
if (params.get("create") === "1") {
  openDialog();
  history.replaceState({}, "", "/community");
}

// Keep the catalog import used and make accidental empty configuration visible.
if (!COMMUNITIES.length) renderCommunities();
