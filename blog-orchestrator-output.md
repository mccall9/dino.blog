# ORQUESTRADOR: Blog Simples com DINO

**Status:** Projeto Inicializado  
**Timeline:** 1-2 semanas  
**Vibes:** Clean, Friendly, Acessível  
**Paleta:** 60% Branco | 30% Preto | 10% Verde (#50C878)

---

## 1. ESCOPO DETALHADO

### Pages Principais (4)
| Page | Objetivo | Complexidade |
|------|----------|-------------|
| **Homepage** | Listar posts + Hero com DINO | P1 |
| **Post Detail** | Ler artigo completo | P1 |
| **About** | Info do blog + DINO mascote | P2 |
| **404** | Página de erro com DINO | P3 |

### Features por Prioridade

#### P1 - CRÍTICO (Semana 1)
- ✅ Listar todos os posts (Homepage)
- ✅ Página de detalhe do post
- ✅ Header + Footer
- ✅ Responsivo (Mobile, Tablet, Desktop)
- ✅ Navegação limpa

#### P2 - IMPORTANTE (Semana 2)
- ✅ Sistema de Tags (filtrar por categoria)
- ✅ Search/Busca simples
- ✅ Posts relacionados (no final de cada post)
- ✅ Página About
- ✅ Meta tags (SEO)

#### P3 - BÔNUS (Se tempo sobrar)
- ⭐ Seção de comentários (Giscus ou Disqus)
- 🔗 Feed RSS (for.xml)
- ✨ Animações DINO (scroll trigger, hover effects)
- 📧 Newsletter signup
- 🌙 Dark mode toggle

---

## 2. STACK RECOMENDADO

### Por quê essa stack?

**Astro**
- Gerador de sites estático ultra-rápido
- Suporta Markdown nativamente
- Zero JS por padrão (melhor performance)
- Perfeito para blogs
- Easy deployment

**TailwindCSS**
- Utility-first CSS
- Rápido de prototipa
- Muito responsivo
- Paleta simples (branco/preto/verde)

**Markdown + Frontmatter**
- Posts como arquivos `.md`
- Fácil de versionar no Git
- Sem DB necessário
- Content-first workflow

### Stack Completo
```
Astro + TailwindCSS + Markdown + Vercel
```

### Hosting
**Vercel** (Gratuito)
- Deploy automático do GitHub
- CDN global
- Fast analytics
- Environment variables

---

## 3. ESTRUTURA DE DADOS

### Folder Structure
```
blog-dino/
├── public/
│   ├── dino/
│   │   ├── hero.svg
│   │   ├── about.svg
│   │   ├── 404.svg
│   │   └── loading.svg
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Card.astro
│   │   ├── Tag.astro
│   │   ├── SearchBox.astro
│   │   ├── RelatedPosts.astro
│   │   ├── PostMeta.astro
│   │   ├── Dino.astro (mascote)
│   │   └── Navigation.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PostLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── index.astro (Homepage)
│   │   ├── posts/
│   │   │   └── [...slug].astro (Dynamic route)
│   │   ├── about.astro
│   │   ├── tags/
│   │   │   └── [...tag].astro
│   │   ├── 404.astro
│   │   └── rss.xml.js (Optional)
│   ├── content/
│   │   └── posts/
│   │       ├── primeiro-post.md
│   │       ├── segundo-post.md
│   │       └── terceiro-post.md
│   ├── utils/
│   │   ├── posts.ts (queries)
│   │   ├── search.ts
│   │   └── helpers.ts
│   └── styles/
│       └── global.css (TailwindCSS imports)
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### Post Markdown Structure
```markdown
---
title: "Meu Primeiro Post"
description: "Descrição curta para preview"
author: "Seu Nome"
date: 2025-07-16
tags: ["astro", "blog", "tutorial"]
image: "/cover-image.jpg"
---

# Conteúdo do post

Lorem ipsum...
```

### Database Schema (Simples)
**posts.json** (gerado automaticamente do Markdown)
```json
{
  "posts": [
    {
      "id": "primeiro-post",
      "title": "Meu Primeiro Post",
      "description": "...",
      "author": "Nome",
      "date": "2025-07-16",
      "tags": ["astro", "blog"],
      "image": "/cover.jpg",
      "slug": "primeiro-post",
      "content": "..."
    }
  ]
}
```

---

## 4. TIMELINE REALISTA

### SEMANA 1: Setup + Estrutura + Layouts

**Dia 1-2: Setup Inicial**
- [ ] Criar repo no GitHub
- [ ] Init Astro project + TailwindCSS
- [ ] Setup git workflow
- [ ] Criar branches principais

**Dia 3: Estrutura & Componentes**
- [ ] Criar folder structure
- [ ] Build Header + Footer
- [ ] Build Card component
- [ ] Setup global styles

**Dia 4: Layouts**
- [ ] BaseLayout (template geral)
- [ ] PostLayout (artigos)
- [ ] PageLayout (páginas simples)

**Dia 5: Homepage**
- [ ] Listar posts
- [ ] Hero section com DINO
- [ ] Integrar Card component
- [ ] Responsivo (mobile-first)

**Dia 6: Post Detail + 404**
- [ ] Dynamic post pages
- [ ] Post metadata
- [ ] 404 page com DINO
- [ ] Teste links

**Dia 7: Polish P1**
- [ ] Responsive testing (mobile/tablet/desktop)
- [ ] Performance audit
- [ ] SEO basics
- [ ] QA final

### SEMANA 2: Features P2 + Deploy

**Dia 8-9: Tags + Search**
- [ ] Sistema de tags
- [ ] Página de tags dinâmica
- [ ] Search component
- [ ] Filter logic

**Dia 10: Posts Relacionados + About**
- [ ] Related posts component
- [ ] About page
- [ ] DINO section on About
- [ ] Links internos

**Dia 11: SEO + Meta Tags**
- [ ] Open Graph meta
- [ ] Twitter cards
- [ ] Sitemap.xml
- [ ] robots.txt

**Dia 12: Deploy**
- [ ] Setup Vercel
- [ ] Connect GitHub
- [ ] Deploy preview
- [ ] Setup custom domain (opcional)

**Dia 13-14: P3 Features (se houver tempo)**
- [ ] Comments (Giscus)
- [ ] RSS feed
- [ ] Animações DINO
- [ ] Dark mode

---

## 5. BRIEFING PRO DESIGNER

### 📄 Pages para Designar (4)

1. **Homepage**
   - Hero com DINO (grande e amigável)
   - Grid de posts (cards)
   - CTA para newsletter (P3)

2. **Post Detail**
   - Header de post (title + meta)
   - Conteúdo com tipografia legível
   - Tags
   - Posts relacionados no final

3. **About**
   - Hero com DINO (médio, acolhedor)
   - Texto sobre o blog
   - Social links
   - Credits

4. **404**
   - DINO confuso/triste
   - Mensagem amigável
   - Link volta pra home

### 🧩 Components Necessários (8)

| Component | Onde | Props | Responsivo |
|-----------|------|-------|-----------|
| **Header** | Todas | logo, nav links | Sim |
| **Footer** | Todas | social links, credits | Sim |
| **Card** | Homepage | title, description, date, tags | Sim |
| **Tag** | Posts, Cards | label, onClick | Sim |
| **SearchBox** | Header/Page | placeholder, onSearch | Sim |
| **PostMeta** | Post detail | author, date, readTime | Sim |
| **RelatedPosts** | Post detail | posts[] | Sim |
| **Dino** | Hero, About, 404 | pose (hero/about/sad/loading) | Sim |

### 🦕 Uso do DINO

| Página | Pose | Tamanho | Context |
|--------|------|--------|---------|
| Homepage | `hero` | Grande (60%) | Bem-vindo! Explore posts |
| About | `about` | Médio (40%) | Conhece o blog |
| 404 | `sad` | Médio (40%) | "Ops, perdi aqui!" |
| Loading (P3) | `loading` | Pequeno (30%) | Spinner animado |

### 🎨 Paleta de Cores

```
WHITE      #FFFFFF  (60%) - Background, text spaces
BLACK      #000000  (30%) - Text, borders, accents
GREEN      #50C878  (10%) - Links, hover, CTAs, DINO eyes
```

### Design Tokens (Tailwind)
```javascript
{
  colors: {
    'dino-white': '#FFFFFF',
    'dino-black': '#000000',
    'dino-green': '#50C878',
  },
  spacing: { /* 8px base */ },
  typography: { /* Sans-serif, clean */ }
}
```

### Referências
- **Style:** biip.club (friendly, accessible, minimalist)
- **Vibe:** Adorável, não cute demais
- **Accessibility:** WCAG AA (contraste, legibilidade)
- **Typography:** System fonts (rápido, acessível)

---

## 6. PRÓXIMOS PASSOS

### ✅ Designer
1. [ ] Criar wireframes (4 pages)
2. [ ] Design visual (Figma/Adobe)
3. [ ] Criar DINO em 4 poses (SVG)
4. [ ] Guideline de componentes

### ✅ Dev
1. [ ] Init Astro + Config
2. [ ] Setup TailwindCSS
3. [ ] Criar base components
4. [ ] Estrutura de pastas
5. [ ] 3-5 posts de exemplo

### ✅ Content
1. [ ] Escrever 5 posts iniciais
2. [ ] Prepare about page
3. [ ] Definir author info

---

## 7. DEFINIÇÕES RÁPIDAS

| Aspecto | Decisão |
|--------|---------|
| **Language** | Português (pt-BR) |
| **Dark mode** | Não (v1) |
| **Comments** | Giscus (P3) |
| **Analytics** | Vercel Analytics (free) |
| **CMS** | Nenhum (Git-based) |
| **Payments** | Nenhum |
| **Auth** | Nenhuma |

---

**Status:** 🚀 Pronto para Iniciar  
**Versão:** 1.0  
**Última atualização:** 2025-07-16
