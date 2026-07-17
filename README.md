# dino.blog

> Ideias simples. Curiosidade gigante.

Blog e comunidade em português (pt-BR) para pessoas curiosas compartilharem ideias, descobertas, perguntas e projetos em construção.

🌐 **Site:** https://dinoclub.blog/

## Stack

- **Front-end:** HTML + CSS + JavaScript (módulos ES, sem etapa de build)
- **Back-end:** [Supabase](https://supabase.com) — autenticação por código de e-mail (OTP, sem senha) e PostgreSQL
- **Hospedagem:** [Vercel](https://vercel.com) — deploy contínuo a partir deste repositório

## Páginas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `index.html` | Página inicial e artigos em destaque |
| `/post` | `post.html` | Artigo do blog |
| `/about` | `about.html` | Sobre o projeto |
| `/community` | `community.html` | Diretório de comunidades |
| `/community/clube-dos-curiosos` | `community-detail.html` | Página da comunidade (rewrite em `vercel.json`) |
| `/login` | `login.html` | Entrar com código de e-mail (`noindex`) |
| `/feed` | `feed.html` | Conversas da comunidade, autenticado (`noindex`) |
| `/profile` | `profile.html` | Perfil do usuário, autenticado (`noindex`) |
| — | `404.html` | Página de erro |

## Módulos JavaScript

| Arquivo | Papel |
|---|---|
| `supabase-client.js` | Cliente Supabase (chave *publishable*, segura para uso no navegador) |
| `auth-service.js` | Sessão, login por OTP e perfil |
| `conversation-service.js` | Posts e comentários do feed via Supabase |
| `community-service.js` | Comunidades: interesse, membros e contagem |
| `community-catalog.js` | Catálogo estático de comunidades |
| `feed.js` / `community.js` / `community-detail.js` / `login.js` / `profile.js` | Lógica de cada página |

## Segurança e privacidade

- O banco usa **Row Level Security** em todas as tabelas; a chave publishable só acessa o que as policies permitem.
- `/login`, `/feed` e `/profile` são `noindex,nofollow` e bloqueadas no `robots.txt`.
- Headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) configurados em `vercel.json`.
- Segredos de ambiente ficam fora do repositório (ver `.gitignore`).

## SEO e descoberta

`sitemap.xml`, `robots.txt`, `rss.xml`, `llms.txt` e `site.webmanifest` na raiz.

## Licença

[MIT](LICENSE)
