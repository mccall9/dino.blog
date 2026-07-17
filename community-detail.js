import { communityService } from "./community-service.js";

const slug = "clube-dos-curiosos";
const joinButton = document.querySelector("#join-community");
const status = document.querySelector("#detail-status");
const memberCount = document.querySelector("#member-count");
const accountLink = document.querySelector(".nav-links .button");
let isMember = false;

if (await communityService.currentUser()) {
  accountLink.href = "/profile";
  accountLink.textContent = "Perfil →";
}

function loginForJoin() {
  const next = encodeURIComponent(
    "/community/clube-dos-curiosos?action=join",
  );
  location.href = `/login?next=${next}`;
}

async function refreshMembership() {
  const user = await communityService.currentUser();
  if (!user) {
    joinButton.textContent = "Entrar no clube →";
    return;
  }

  try {
    isMember = await communityService.isMember(slug);
    joinButton.textContent = isMember ? "Abrir conversas →" : "Entrar no clube →";
  } catch (error) {
    status.textContent = error.message;
  }
}

async function join() {
  const user = await communityService.currentUser();
  if (!user) return loginForJoin();
  if (isMember) {
    location.href = "/feed";
    return;
  }

  joinButton.disabled = true;
  joinButton.textContent = "Entrando…";
  status.textContent = "";
  try {
    await communityService.join(slug);
    isMember = true;
    joinButton.textContent = "Abrir conversas →";
    status.textContent = "Você entrou no Clube dos Curiosos.";
    const total = await communityService.memberCount(slug);
    if (total !== null) {
      memberCount.textContent = `${total} ${total === 1 ? "participante" : "participantes"}`;
    }
  } catch (error) {
    status.textContent = error.message;
    joinButton.textContent = "Entrar no clube →";
  } finally {
    joinButton.disabled = false;
  }
}

joinButton.addEventListener("click", join);

const total = await communityService.memberCount(slug);
if (total !== null) {
  memberCount.textContent = `${total} ${total === 1 ? "participante" : "participantes"}`;
}
await refreshMembership();

const params = new URLSearchParams(location.search);
if (params.get("action") === "join" && (await communityService.currentUser())) {
  await join();
  history.replaceState({}, "", "/community/clube-dos-curiosos");
}
