import { service as store } from "./conversation-service.js";
const categories = [
  ["Todos", "Todos"],
  ["Ideia", "Ideias"],
  ["Pergunta", "Perguntas"],
  ["Descoberta", "Descobertas"],
  ["Estou criando", "Estou criando"],
  ["Preciso de ajuda", "Preciso de ajuda"],
];
const $ = (s) => document.querySelector(s),
  els = {
    list: $("#feed-list"),
    empty: $("#feed-empty"),
    emptyText: $("#feed-empty p"),
    filters: $("#category-filters"),
    search: $("#feed-search"),
    sidebar: $("#community-sidebar"),
    modal: $("#conversation-modal"),
    form: $("#post-form"),
    picker: $("#category-picker"),
    modalTitle: $("#modal-title"),
    title: $("#post-title"),
    description: $("#post-description"),
    link: $("#post-link"),
    submit: $("#submit-post"),
    formStatus: $("#post-form-status"),
    toast: $("#toast"),
    confirm: $("#confirm-dialog"),
  };
let posts = [],
  filter = "Todos",
  query = "",
  editingId = null,
  deleteId = null,
  lastFocus = null;
const node = (tag, className, text) => {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
};
const time = (value) => {
  const min = Math.floor((Date.now() - new Date(value)) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  return h < 24
    ? `há ${h} h`
    : new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
      }).format(new Date(value));
};
const safeLink = (value) => {
  if (!value) return "";
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
};
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 2600);
}
function avatar(author, size = "") {
  const img = node("img", `conversation-avatar ${size}`);
  img.src = author.avatar;
  img.alt = "";
  return img;
}
function renderFilters() {
  els.filters.replaceChildren(
    ...categories.map(([value, label]) => {
      const b = node("button", "filter-pill", label);
      b.type = "button";
      b.classList.toggle("active", filter === value);
      b.setAttribute("aria-pressed", String(filter === value));
      b.onclick = () => {
        filter = value;
        render();
      };
      return b;
    }),
  );
}
function comments(post) {
  const wrap = node("section", "comments"),
    list = node("div", "comment-list");
  post.comments.forEach((c) => {
    const item = node("div", "comment"),
      body = node("div"),
      meta = node("div", "comment-meta");
    item.append(avatar(c.author, "small"));
    meta.append(
      node("strong", "", c.author.name),
      node("span", "", time(c.createdAt)),
    );
    if (c.author.id === store.currentUser.id) {
      const remove = node("button", "comment-delete", "Apagar");
      remove.type = "button";
      remove.onclick = async () => {
        try {
          posts = await store.removeComment(post.id, c.id);
          render();
          toast("Comentário apagado.");
        } catch (e) {
          toast(e.message);
        }
      };
      meta.append(remove);
    }
    body.append(meta, node("p", "", c.text));
    item.append(body);
    list.append(item);
  });
  const form = node("form", "comment-form"),
    input = node("textarea"),
    send = node("button", "button secondary", "Enviar");
  input.placeholder = "Escreva um comentário";
  input.required = true;
  input.maxLength = 500;
  send.type = "submit";
  form.append(input, send);
  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    send.disabled = true;
    send.textContent = "Enviando…";
    try {
      posts = await store.comment(post.id, text);
      render();
      toast("Comentário enviado.");
    } catch (error) {
      send.disabled = false;
      send.textContent = "Enviar";
      toast(error.message);
    }
  };
  wrap.append(list, form);
  return wrap;
}
function card(post) {
  const article = node("article", "conversation-card"),
    head = node("div", "conversation-head"),
    identity = node("div", "conversation-author"),
    badges = node("div", "conversation-badges");
  article.dataset.id = post.id;
  identity.append(avatar(post.author), node("div"));
  identity.lastChild.append(
    node("strong", "", post.author.name),
    node("span", "", time(post.createdAt)),
  );
  if (post.pinned) badges.append(node("span", "pin-badge", "Fixado"));
  badges.append(node("span", "category-badge", post.category));
  head.append(identity, badges);
  if (post.author.id === store.currentUser.id) {
    const menu = node("div", "owner-actions"),
      edit = node("button", "text-button", "Editar"),
      del = node("button", "text-button", "Excluir");
    edit.type = del.type = "button";
    edit.onclick = () => openModal(post);
    del.onclick = () => askDelete(post.id);
    menu.append(edit, del);
    head.append(menu);
  }
  const description = node("p", "conversation-description", post.description);
  article.append(head, node("h2", "", post.title), description);
  if (post.description.length > 360) {
    description.classList.add("collapsed");
    const expand = node("button", "expand-post", "Ver mais");
    expand.type = "button";
    expand.setAttribute("aria-expanded", "false");
    expand.onclick = () => {
      const expanded = description.classList.toggle("expanded");
      expand.textContent = expanded ? "Ver menos" : "Ver mais";
      expand.setAttribute("aria-expanded", String(expanded));
    };
    article.append(expand);
  }
  const url = safeLink(post.link);
  if (url) {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    const a = node("a", "conversation-link");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.append(
      node("span", "conversation-link-domain", domain),
      node("span", "conversation-link-label", "Abrir referência ↗"),
    );
    article.append(a);
  }
  const meta = node("div", "conversation-meta");
  meta.append(node("span", "", `${post.comments.length} comentários`));
  const saved = post.savedBy.includes(store.currentUser.id),
    bookmark = node(
      "button",
      `bookmark-button${saved ? " active" : ""}`,
      saved ? "⚑" : "⚐",
    );
  bookmark.type = "button";
  bookmark.title = saved ? "Remover dos salvos" : "Salvar publicação";
  bookmark.setAttribute("aria-label", bookmark.title);
  bookmark.setAttribute("aria-pressed", String(saved));
  bookmark.onclick = async () => {
    bookmark.disabled = true;
    try {
      posts = await store.toggleSaved(post.id, saved);
      render();
    } catch (e) {
      bookmark.disabled = false;
      toast(e.message);
    }
  };
  meta.append(bookmark);
  article.append(meta, comments(post));
  return article;
}
function renderSidebar() {
  const authors = new Set(posts.map((p) => p.author.id)).size,
    projects = posts.filter((p) => p.category === "Estou criando").length;
  els.sidebar.replaceChildren(
    node("h2", "", "Clube dos Curiosos"),
    node(
      "p",
      "",
      "Um espaço para compartilhar ideias, perguntas, descobertas e coisas que ainda estão sendo construídas.",
    ),
  );
  const stats = node("div", "community-stats");
  [
    [authors, "participantes"],
    [posts.length, "conversas"],
    [projects, "projetos"],
  ].forEach(([n, l]) => {
    const d = node("div");
    d.append(node("strong", "", String(n)), node("span", "", l));
    stats.append(d);
  });
  const rules = node("ul", "community-rules");
  [
    "Traga contexto.",
    "Escute com curiosidade.",
    "Discorde com respeito.",
  ].forEach((x) => rules.append(node("li", "", x)));
  els.sidebar.append(stats, rules);
}
function render() {
  renderFilters();
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = posts.filter((p) => {
    const matchesCategory = filter === "Todos" || p.category === filter;
    const searchable = [p.title, p.description, p.category, p.author.name]
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return (
      matchesCategory &&
      (!normalizedQuery || searchable.includes(normalizedQuery))
    );
  });
  els.list.replaceChildren(...filtered.map(card));
  els.empty.hidden = filtered.length > 0;
  els.emptyText.textContent = normalizedQuery
    ? "Nenhuma conversa encontrada para essa busca."
    : "Nenhuma conversa por aqui ainda. Que tal começar?";
  renderSidebar();
}
function renderPicker(selected = "") {
  els.picker.replaceChildren(
    ...categories.slice(1).map(([value, label], i) => {
      const id = `cat-${i}`,
        l = node("label", "category-option"),
        input = node("input");
      input.type = "radio";
      input.name = "category";
      input.value = value;
      input.id = id;
      input.checked = value === selected;
      l.htmlFor = id;
      l.append(input, node("span", "", label));
      return l;
    }),
  );
}
function clearErrors() {
  els.form
    .querySelectorAll(".field-error")
    .forEach((x) => (x.textContent = ""));
  els.form
    .querySelectorAll("[aria-invalid]")
    .forEach((x) => x.removeAttribute("aria-invalid"));
  els.formStatus.textContent = "";
  els.formStatus.classList.remove("error");
}
function autoResizeDescription() {
  els.description.style.height = "auto";
  els.description.style.height = `${els.description.scrollHeight}px`;
}
function formStatus(message, isError = false) {
  els.formStatus.textContent = message;
  els.formStatus.classList.toggle("error", isError);
  els.formStatus.setAttribute("role", isError ? "alert" : "status");
}
function openModal(post = null) {
  lastFocus = document.activeElement;
  editingId = post?.id || null;
  els.modalTitle.textContent = post ? "Editar publicação" : "Nova publicação";
  els.submit.textContent = post ? "Salvar alterações" : "Publicar";
  els.title.value = post?.title || "";
  els.description.value = post?.description || "";
  els.link.value = post?.link || "";
  renderPicker(post?.category || "");
  clearErrors();
  els.modal.showModal();
  autoResizeDescription();
}
function closeModal() {
  els.modal.close();
  editingId = null;
  els.form.reset();
  lastFocus?.focus();
}
function validate() {
  clearErrors();
  let ok = true,
    firstInvalid = null,
    category = els.form.querySelector("[name=category]:checked");
  if (!category) {
    $("#category-error").textContent = "Escolha uma categoria.";
    els.picker.closest("fieldset").setAttribute("aria-invalid", "true");
    firstInvalid = els.picker.querySelector("input");
    ok = false;
  }
  [
    [els.title, "Informe um título."],
    [els.description, "Informe uma descrição."],
  ].forEach(([f, m]) => {
    if (!f.value.trim()) {
      f.setAttribute("aria-invalid", "true");
      f.nextElementSibling.textContent = m;
      firstInvalid ||= f;
      ok = false;
    }
  });
  if (els.link.value && !safeLink(els.link.value)) {
    els.link.setAttribute("aria-invalid", "true");
    els.link.nextElementSibling.textContent = "Use http:// ou https://.";
    firstInvalid ||= els.link;
    ok = false;
  }
  if (!ok && firstInvalid) {
    firstInvalid.closest("fieldset,.form-row").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setTimeout(() => firstInvalid.focus({ preventScroll: true }), 250);
  }
  return ok;
}
function askDelete(id) {
  deleteId = id;
  els.confirm.showModal();
}
document
  .querySelectorAll("#composer-trigger,[data-open-modal]")
  .forEach((b) => (b.onclick = () => openModal()));
els.search.addEventListener("input", () => {
  query = els.search.value;
  render();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "/" &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
  ) {
    event.preventDefault();
    els.search.focus();
  }
});
$("#close-modal").onclick = $("#cancel-modal").onclick = closeModal;
els.description.addEventListener("input", autoResizeDescription);
els.modal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModal();
});
$("#cancel-delete").onclick = () => els.confirm.close();
$("#confirm-delete").onclick = async () => {
  const b = $("#confirm-delete");
  b.disabled = true;
  b.textContent = "Excluindo…";
  try {
    posts = await store.remove(deleteId);
    els.confirm.close();
    render();
    toast("Publicação excluída.");
  } catch (e) {
    toast(e.message);
  } finally {
    b.disabled = false;
    b.textContent = "Excluir";
  }
};
els.form.onsubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  const wasEditing = Boolean(editingId),
    id = editingId,
    data = {
      category: els.form.querySelector("[name=category]:checked").value,
      title: els.title.value.trim(),
      description: els.description.value.trim(),
      link: safeLink(els.link.value),
    };
  els.submit.disabled = true;
  els.submit.textContent = wasEditing ? "Salvando…" : "Publicando…";
  formStatus(wasEditing ? "Salvando publicação…" : "Publicando…");
  try {
    posts = wasEditing
      ? await store.update(id, data)
      : await store.create(data);
    closeModal();
    render();
    toast(wasEditing ? "Publicação atualizada." : "Publicação criada.");
  } catch (error) {
    console.error("Falha ao salvar publicação", error);
    formStatus(
      error.message || "Não foi possível publicar. Tente novamente.",
      true,
    );
  } finally {
    els.submit.disabled = false;
    if (els.modal.open)
      els.submit.textContent = wasEditing ? "Salvar alterações" : "Publicar";
  }
};
els.modal.onclick = (e) => {
  if (e.target === els.modal) closeModal();
};
try {
  await store.init();
  posts = await store.list();
  render();
} catch (error) {
  if (error.message.includes("login")) location.replace("/login?next=/feed");
  else {
    els.list.append(
      node("div", "feed-empty", `Não foi possível carregar: ${error.message}`),
    );
    renderFilters();
  }
}
window.addEventListener("focus", async () => {
  try {
    posts = await store.list();
    render();
  } catch {}
});
