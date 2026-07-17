# 🎨 BLOG SIMPLES COM DINO - Design System & Specs

## 1. DESIGN SYSTEM

### Colors
```
Primary:    #FFFFFF (Branco - 60%)
Secondary:  #1A1A1A (Preto - 30%)
Accent:     #50C878 (Verde - 10%)

Neutrals:
- White:      #FFFFFF
- Off-White:  #F5F5F5
- Light Gray: #E8E8E8
- Dark Gray:  #333333
- Black:      #1A1A1A

Semantic:
- Success:    #50C878
- Hover:      #3BA85E (Verde escuro)
- Focus:      #50C878 (com 2px outline)
- Error:      #D32F2F (rare usage)
```

### Typography
```
Font Family: System stack -webkit-system-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

Sizes:
- XS:    12px (captions, tags)
- SM:    14px (secondary text, labels)
- Base:  16px (body text - default)
- MD:    18px (labels, UI text)
- LG:    24px (subheadings)
- XL:    32px (section titles)
- 2XL:   48px (main headings)

Weights:
- Regular: 400
- Bold:    600

Line Heights:
- Tight:  1.2 (headings)
- Normal: 1.5 (body)
- Relaxed: 1.75 (long form)
```

### Spacing (8px Grid)
```
XS:   4px    (minimal gaps)
SM:   8px    (small margins)
MD:   16px   (default padding)
LG:   24px   (section spacing)
XL:   32px   (large sections)
2XL:  48px   (major sections)
3XL:  64px   (page margins)
```

### Border Radius
```
Small:    4px   (inputs, small components)
Default:  8px   (cards, buttons - default)
Large:    16px  (hero sections, featured images)
Full:     9999px (circles - avatars)
```

### Shadows
```
Subtle:    0 1px 3px rgba(26, 26, 26, 0.12)
Medium:    0 2px 8px rgba(26, 26, 26, 0.15)
(Use rarely - design minimalista!)
```

---

## 2. COMPONENTES

### Button
```
PRIMARY (Green)
- Background:  #50C878
- Text:        #FFFFFF
- Padding:     MD (16px vertical, 24px horizontal)
- Border-radius: 8px
- Font:        Base (16px) Bold (600)
- Hover:       #3BA85E (darker green)
- Focus:       2px solid #50C878 outline
- Disabled:    opacity 0.5
- Min height:  48px (touch target)

SECONDARY (Black)
- Background:  #1A1A1A
- Text:        #FFFFFF
- Padding:     MD
- Border-radius: 8px
- Hover:       #333333 (slightly lighter)
- Focus:       2px solid #1A1A1A outline
- Disabled:    opacity 0.5

GHOST (Transparent)
- Background:  transparent
- Border:      2px solid #1A1A1A
- Text:        #1A1A1A
- Padding:     MD
- Border-radius: 8px
- Hover:       background #F5F5F5
- Focus:       2px solid #1A1A1A outline
```

### Card (Post)
```
Layout:
- Image:      16:9 aspect ratio, 100% width
- Border-radius: 8px (top corners)
- Background: #FFFFFF
- Border:     1px solid #E8E8E8 (subtle)
- Padding:    MD (16px)
- Shadow:     Subtle (0 1px 3px)
- Max-width:  400px (responsive)

Content:
- Image height: 225px (on 400px card)
- Title:     LG (24px) Bold (#1A1A1A)
- Excerpt:   Base (16px) Regular (#333333)
- Gap:       SM between elements

Meta:
- Display:   date + author (SM text, gray)
- Color:     #666666 (60% opacity black)

Hover State:
- Shadow:    Medium (lift effect)
- Transform: translateY(-2px)
- Cursor:    pointer
```

### Header
```
Layout:
- Height:      64px
- Background:  #FFFFFF
- Border:      1px solid #E8E8E8 (bottom)
- Padding:     SM (8px) horizontal LG (24px)
- Display:     flex, space-between, align-center

Logo:
- Font:        XL (32px) Bold #1A1A1A
- Text:        "Blog"
- With:        small DINO icon (24px) next to text

Navigation:
- Display:     flex, gap MD (16px)
- Links:       Base (16px), #1A1A1A
- Hover:       #50C878 (text color)
- Focus:       underline + outline
- Hidden on mobile (hamburger menu < 768px)
```

### Footer
```
Layout:
- Background:  #1A1A1A
- Color:       #FFFFFF
- Padding:     2XL (48px vertical), LG (24px) horizontal
- Text-align:  center

Content:
- Copyright:   SM (14px) © 2024 Blog com Dino
- Links:       Base (16px) secondary navigation
- Spacing:     MD between sections

Links color:  #50C878 (accent)
Hover:        #FFFFFF
```

### Search Input
```
Layout:
- Height:      48px
- Width:       100% (responsive max-width 600px)
- Padding:     SM (8px) MD (16px)
- Border:      2px solid #E8E8E8
- Border-radius: 8px
- Background:  #FFFFFF
- Font:        Base (16px)

Focus State:
- Border:      2px solid #50C878
- Box-shadow:  0 0 0 3px rgba(80, 200, 120, 0.1)
- Outline:     none

Placeholder:
- Color:       #999999
- Font style:  Regular
```

### Post Meta
```
Layout:
- Display:     flex, gap MD (16px)
- Font:        SM (14px) Regular
- Color:       #666666

Elements:
- Date:        format "DD de MMM, YYYY"
- Author:      "by [Name]"
- Read time:   "~5 min read"

Separator:    "•" between items
```

### Related Posts Section
```
Layout:
- Title:       "Artigos Relacionados" (LG, 24px Bold)
- Grid:        3 columns (desktop), 2 (tablet), 1 (mobile)
- Gap:         LG (24px)
- Margin top:  2XL (48px)

Uses:
- Card component (smaller version)
- Max 3 posts
- Same hover behavior as homepage cards
```

### Hero Section
```
Layout:
- Background:  #FFFFFF (or #F5F5F5 subtle)
- Padding:     3XL (64px vertical)
- Display:     flex, center, column
- Gap:         LG (24px)

Content:
- Tagline:     "Histórias, ideias, conversas"
- Font:        2XL (48px) Bold #1A1A1A
- Subtitle:    Base (16px) Regular #333333
- DINO:        300-400px (animated, centered)
- CTA Button:  Primary button

Mobile (< 768px):
- Padding:     LG (24px)
- Tagline:     XL (32px)
- DINO:        200px
```

---

## 3. WIREFRAMES - 4 PÁGINAS

### PAGE 1: HOMEPAGE

```
┌─────────────────────────────────┐
│  🦖 BLOG        | About | etc   │  Header
├─────────────────────────────────┤
│                                 │
│   Histórias, ideias, conversas  │  Hero Section
│                                 │  Tagline
│          [🦖 DINO 400px]        │  Mascote
│                                 │  
│        [EXPLORAR ARTIGOS]       │  CTA Button
│                                 │
├─────────────────────────────────┤
│  🔍 [      Buscar...      ]     │  Search Bar
├─────────────────────────────────┤
│                                 │
│  ┌──────────┐ ┌──────────┐     │
│  │ POST 1   │ │ POST 2   │     │  Grid 3 colunas
│  │ [IMG]    │ │ [IMG]    │     │  (responsive)
│  │ Título   │ │ Título   │     │
│  │ Excerpt  │ │ Excerpt  │     │
│  │ Meta     │ │ Meta     │     │
│  └──────────┘ └──────────┘ ... │
│                                 │
│  ┌──────────┐ ┌──────────┐     │
│  │ POST 4   │ │ POST 5   │ ... │
│  ...                            │
│                                 │
├─────────────────────────────────┤
│  © 2024 Blog com Dino           │  Footer
│  About | Contact | RSS          │
└─────────────────────────────────┘
```

**Mobile (375px):**
- Hero: DINO 200px, tagline XL
- Search: full width
- Posts: 1 coluna, full width

**Tablet (768px):**
- Grid: 2 colunas

---

### PAGE 2: POST DETAIL

```
┌─────────────────────────────────┐
│  🦖 BLOG        | About | etc   │  Header
├─────────────────────────────────┤
│                                 │
│  Título do Artigo Longo Aqui   │  Post Title (2XL)
│  by Autor | 15 de Jul | ~5min  │  Meta info
│                                 │
├─────────────────────────────────┤
│                                 │
│      ┌───────────────────┐      │  Featured Image
│      │                   │      │  16:9 aspect
│      │                   │      │  Radius 16px
│      └───────────────────┘      │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Lorem ipsum dolor sit amet...  │  Post Content Body
│  Dino ipsum dino ipsum...       │  Line-height 1.75
│  [Multiple paragraphs]          │  Base (16px) text
│                                 │
│  > Quoted text if any           │  Blockquote styling
│                                 │
│  # Heading 2 inside content     │  LG (24px) Bold
│                                 │
├─────────────────────────────────┤
│                                 │
│  Artigos Relacionados           │  Related Posts
│                                 │  Section Title
│  ┌──────────┐ ┌──────────┐     │
│  │ POST A   │ │ POST B   │ ... │  3 Post Cards
│  └──────────┘ └──────────┘     │  Smaller version
│                                 │
├─────────────────────────────────┤
│  © 2024 Blog com Dino           │  Footer
└─────────────────────────────────┘
```

**Responsive:**
- Desktop: max-width 800px content (centered)
- Tablet: full width LG padding
- Mobile: full width SM padding

---

### PAGE 3: ABOUT

```
┌─────────────────────────────────┐
│  🦖 BLOG        | About | etc   │  Header
├─────────────────────────────────┤
│                                 │
│           Sobre o Blog          │  Page Title (2XL)
│                                 │
├─────────────────────────────────┤
│                                 │
│   [Avatar autor 80px rounded]   │  Author section
│   Nome Autor                    │
│   Bio/Description               │
│   (SM text, 2-3 linhas)        │
│                                 │
├─────────────────────────────────┤
│                                 │
│      [🦖 DINO 250-300px]       │  Hero mascote
│      Friendly pose              │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Missão: Compartilhar ideias... │  Content section
│  Conteúdo sobre design, web,    │  Base text
│  tecnologia, life...            │
│                                 │
│        [CONTATE-ME]             │  CTA Button
│                                 │
├─────────────────────────────────┤
│  © 2024 Blog com Dino           │  Footer
└─────────────────────────────────┘
```

**Mobile:**
- DINO: 200px
- Avatar: 64px
- Single column

---

### PAGE 4: 404 - NOT FOUND

```
┌─────────────────────────────────┐
│  🦖 BLOG        | About | etc   │  Header
├─────────────────────────────────┤
│                                 │
│      [🦖 DINO Confuso 250px]   │  Sad/confused mascote
│      (head tilted, lost vibes)  │
│                                 │
├─────────────────────────────────┤
│                                 │
│         Ops! 404                │  Title (2XL)
│                                 │
│   Página não encontrada :(      │  Message (Base)
│                                 │
│    [VOLTAR À HOME]              │  Primary Button
│                                 │
├─────────────────────────────────┤
│  © 2024 Blog com Dino           │  Footer
└─────────────────────────────────┘
```

---

## 4. DINO MASCOT GUIDELINE

### Tamanhos

| Context | Width | Height | Purpose |
|---------|-------|--------|---------|
| Hero Homepage | 400px | 400px | Focal point |
| Hero About | 300px | 300px | Secondary focal |
| 404 Page | 250px | 250px | Central element |
| Search Results | 200px | 200px | Large illustration |
| Header Logo | 24px | 24px | Navigation icon |
| Small UI | 48-64px | 48-64px | Icon usage |

### Colores & Style

```
Base Color:   #50C878 (verde accent)
Secondary:    #FFFFFF (branco highlights)
Outline:      #1A1A1A (black details - eyes, mouth)
Texture:      Flat design, friendly

Style Reference:
- Inspiration: biip.club mascote
- Vibes: cute, approachable, 3D-ish but flat
- Expressions: happy (default), confused (404), thinking (loading)
- Proportions: oversized head, small body, big eyes
```

### Posicionamento

**Homepage Hero:**
- Horizontal: centered
- Vertical: middle of hero section
- Animation: gentle bounce (infinite, 3s) ✨

**About Page:**
- Horizontal: centered
- Vertical: below bio section
- Animation: subtle rotation on hover (5° max)

**404 Page:**
- Horizontal: centered
- Vertical: top-middle of content area
- Animation: head tilt (sad pose, static)

**Header Logo:**
- Position: left of "Blog" text
- Vertical: center-aligned with text
- Size: 24px

**Variations:**
- Happy (default): smile, open eyes ☺️
- Confused (404/error): tilted head, question mark eyes
- Thinking (loading): hand on chin
- Winking (interactive): one eye closed (on hover)

### Animations (Bonus)

```css
@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
/* 3s infinite, ease-in-out */

@keyframes tilt-left {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-5deg); }
}
/* 2s infinite on hover */

@keyframes wink {
  0%, 49% { /* normal eye */ }
  50%, 100% { /* winking eye */ }
}
/* 3s infinite on hover */
```

---

## 5. RESPONSIVIDADE

### Breakpoints

```
Mobile:    < 640px   (375px reference)
Tablet:    640px - 1023px (768px reference)
Desktop:   ≥ 1024px
```

### Grid System

| Device | Columns | Gap | Padding |
|--------|---------|-----|---------|
| Mobile | 1 | 16px | 16px |
| Tablet | 2 | 20px | 24px |
| Desktop | 3 | 24px | 32px |

### Component Adjustments

**Header:**
- Mobile: Hamburger menu (no nav visible)
- Tablet: Nav visible, smaller font
- Desktop: Full nav, full size

**Typography Scaling:**
- Headings (2XL): 48px → 36px → 28px
- Section titles (XL): 32px → 28px → 24px
- Body: 16px (constant across all)

**Spacing Reduction:**
- Mobile: -30% (use smaller spacing values)
- Tablet: -15%
- Desktop: 100%

**Images:**
- Mobile: object-fit cover, full width
- Featured image: auto height, max-width 100%
- Cards: responsive, maintain 16:9

---

## 6. ACESSIBILIDADE

### Contrast Checking (WCAG AA)

```
✅ #FFFFFF on #1A1A1A:      21:1 (exceeds 4.5:1)
✅ #50C878 on #FFFFFF:      4.5:1 (passes, but verify)
✅ #333333 on #FFFFFF:      10:1 (exceeds 4.5:1)
✅ #666666 on #FFFFFF:      5.3:1 (passes)

⚠️  Always test interactive elements with Lighthouse/WebAIM
```

### Heading Hierarchy

```
H1: Page title (1 per page)
H2: Section titles (Hero, Articles, Related)
H3: Post titles in cards / Subsections
H4+: Never needed (reconsider structure)

Example:
H1: "Blog com Dino"
H2: "Artigos Recentes"
H3: "Título do Artigo" (inside card)
```

### Touch Targets

```
Minimum: 48x48px (WCAG 2.1)
Buttons:  48px height, 24px+ width
Links:    Underlined, larger click area
Icons:    64x64px minimum click area
```

### Focus States

```
All interactive elements require visible focus:
- Outline: 2px solid #50C878
- Offset: 2px
- Style: rounded (matches border-radius)
- Not hidden by overflow

Example focus:
a:focus-visible {
  outline: 2px solid #50C878;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Images & Alt Text

```
Rule: Every image needs descriptive alt text

Examples:
✅ alt="DINO mascote pulando feliz"
✅ alt="Ilustração de notebook com código"
❌ alt="image" (bad)
❌ alt="" (only use if image is decorative AND hidden from screen reader)

Article featured images:
alt="[Headline do artigo]"

DINO mascote:
alt="Mascote DINO do blog, adorável dinossauro verde"
```

### Semantic HTML

```
✅ Use <nav>, <header>, <footer>, <main>, <article>
✅ Use <button> for actions, <a> for navigation
✅ Use <picture> for responsive images
✅ Label form inputs with <label for="id">
✅ Use aria-label for icon buttons
```

### Keyboard Navigation

```
Tab order: logical (top to bottom, left to right)
Skip to main: hidden link at top (keyboard visible)
Focus trap: modals/overlays (if used)
Escape key: close modals
Enter/Space: activate buttons
```

### Mobile Accessibility

```
✅ Minimum font size: 14px (for readability)
✅ Line height: 1.5+ (spacing between lines)
✅ Avoid small touch targets (< 48px)
✅ Color not only indicator (use icons + text)
✅ Text alternatives for images
```

---

## DEVELOPER HANDOFF CHECKLIST

- [ ] Color tokens defined in CSS/SCSS/design-tokens
- [ ] Typography scale exported (font-size, line-height, weight)
- [ ] Spacing scale (4px, 8px, 16px, etc) as variables
- [ ] Border radius tokens (sm, default, large)
- [ ] Shadow presets (subtle, medium)
- [ ] Component stories (Storybook) or documentation
- [ ] Responsive breakpoints as CSS custom properties
- [ ] Focus/hover states implemented on all interactive elements
- [ ] Alt text included on all images
- [ ] Contrast ratios verified (Lighthouse/WebAIM)
- [ ] Touch targets tested (48x48px min)
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] DINO assets exported (all sizes, formats)
- [ ] Animations smooth, < 3s duration

---

**Created by:** DESIGNER | Blog com Dino  
**Version:** 1.0  
**Last Updated:** 2024
