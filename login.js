import { auth } from "./auth-service.js";

const emailForm = document.querySelector("#email-form");
const codeForm = document.querySelector("#code-form");
const emailInput = document.querySelector("#login-email");
const codeInput = document.querySelector("#login-code");
const destination = document.querySelector("#code-destination");
const status = document.querySelector("#auth-status");
const resend = document.querySelector("#resend-code");
const changeEmail = document.querySelector("#change-email");
let email = "";
const requestedNext = new URLSearchParams(location.search).get("next");
function safeNext(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/feed";
  }
  try {
    const target = new URL(value, location.origin);
    return target.origin === location.origin
      ? `${target.pathname}${target.search}${target.hash}`
      : "/feed";
  } catch {
    return "/feed";
  }
}
const nextPath = safeNext(requestedNext);

if (await auth.current()) location.replace(nextPath);

function message(text, error = false) {
  status.textContent = text;
  status.dataset.error = error ? "true" : "false";
}
function loading(button, on, label) {
  button.disabled = on;
  button.textContent = on ? label : button.dataset.label;
}

async function sendCode() {
  email = emailInput.value.trim().toLowerCase();
  if (!emailInput.checkValidity()) return emailInput.reportValidity();
  const button = emailForm.querySelector("button[type=submit]");
  message("");
  loading(button, true, "Enviando código…");
  try {
    await auth.sendEmailCode(email, nextPath);
    destination.textContent = email;
    emailForm.hidden = true;
    codeForm.hidden = false;
    codeInput.focus();
    message("Código enviado. Confira também a caixa de spam.");
  } catch (error) {
    message(error.message, true);
  } finally {
    loading(button, false);
  }
}

emailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendCode();
});
codeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = codeInput.value.replace(/\D/g, "");
  if (token.length !== 8) {
    message("Digite o código de 8 números.", true);
    codeInput.focus();
    return;
  }
  const button = codeForm.querySelector("button[type=submit]");
  message("");
  loading(button, true, "Verificando…");
  try {
    await auth.verifyEmailCode(email, token);
    location.replace(nextPath);
  } catch (error) {
    message(error.message, true);
    loading(button, false);
  }
});
codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 8);
});
changeEmail.addEventListener("click", () => {
  codeForm.hidden = true;
  emailForm.hidden = false;
  codeInput.value = "";
  message("");
  emailInput.focus();
});
resend.addEventListener("click", async () => {
  resend.disabled = true;
  message("Reenviando…");
  try {
    await auth.sendEmailCode(email, nextPath);
    message("Novo código enviado.");
  } catch (error) {
    message(error.message, true);
  } finally {
    setTimeout(() => {
      resend.disabled = false;
    }, 60000);
  }
});
