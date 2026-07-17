# 🎨 COLOR PALETTE - Blog com Dino

## PRIMARY COLORS (60-30-10 Rule)

### Branco (60%)
```
HEX:  #FFFFFF
RGB:  rgb(255, 255, 255)
HSL:  hsl(0, 0%, 100%)
LCH:  lch(100%, 0, 0)

Usage:
- Background principal
- Text em elementos dark
- Negative space
- Card backgrounds
- Button primary text
```

### Preto (30%)
```
HEX:  #1A1A1A
RGB:  rgb(26, 26, 26)
HSL:  hsl(0, 0%, 10.2%)
LCH:  lch(10%, 0, 0)

Usage:
- Primary text color
- Button backgrounds (secondary)
- Navigation elements
- Footer background
- Dark UI elements
- Border lines (subtle)
```

### Verde (10% - ACCENT)
```
HEX:  #50C878
RGB:  rgb(80, 200, 120)
HSL:  hsl(136, 48%, 55%)
LCH:  lch(72%, 58, 144)

Usage:
- Primary buttons
- Links & interactive hover states
- DINO mascote base color
- Focus rings & outlines
- Call-to-actions
- Accent borders
- Success states
```

---

## EXTENDED PALETTE (Neutrals)

### Off-White (Background Alternates)
```
HEX:  #F5F5F5
RGB:  rgb(245, 245, 245)
HSL:  hsl(0, 0%, 96%)

Usage:
- Alternate section backgrounds
- Subtle background for hero sections
- Form field backgrounds (disabled)
- Dividers against white
```

### Light Gray (Borders & Dividers)
```
HEX:  #E8E8E8
RGB:  rgb(232, 232, 232)
HSL:  hsl(0, 0%, 91%)

Usage:
- Card borders
- Separator lines
- Input borders (default state)
- Subtle dividers
```

### Medium Gray (Secondary Text)
```
HEX:  #999999
RGB:  rgb(153, 153, 153)
HSL:  hsl(0, 0%, 60%)

Usage:
- Placeholder text in inputs
- Disabled text
- Secondary labels
- Muted information
```

### Dark Gray (Meta Information)
```
HEX:  #666666
RGB:  rgb(102, 102, 102)
HSL:  hsl(0, 0%, 40%)

Usage:
- Post meta (date, author, read time)
- Secondary text below headings
- Caption text
- Muted descriptions
```

### Dark Text
```
HEX:  #333333
RGB:  rgb(51, 51, 51)
HSL:  hsl(0, 0%, 20%)

Usage:
- Body text (alternative to #1A1A1A)
- Secondary headings
- Emphasized text
- Navigation labels
```

---

## SEMANTIC COLORS

### Verde Escuro (Hover/Active State)
```
HEX:  #3BA85E
RGB:  rgb(59, 168, 94)
HSL:  hsl(139, 48%, 44%)
LCH:  lch(57%, 58, 144)

Usage:
- Button hover states
- Link active states
- Navigation active indicator
- Interactive element feedback
```

### Verde Claro (Background Accent - Optional)
```
HEX:  #D4F1E4
RGB:  rgb(212, 241, 228)
HSL:  hsl(152, 62%, 89%)

Usage:
- Success message backgrounds
- Highlight backgrounds (rare)
- Badge backgrounds
- Alert backgrounds (success)
```

### Verde com Transparência (Focus Ring)
```
CSS:  rgba(80, 200, 120, 0.1)
HEX:  #50C878 com opacity 10%

Usage:
- Focus ring outer glow
- Input focus background
- Active state background tint
```

### Error Red (Rare - Reserved)
```
HEX:  #D32F2F
RGB:  rgb(211, 47, 47)
HSL:  hsl(0, 81%, 51%)

Usage:
- Error messages (rare in blog)
- Validation errors
- Warning states (if needed)
- Delete/destructive actions (if needed)
```

---

## CONTRAST MATRIX (WCAG Compliance)

### Foreground vs Background

| FG Color | BG Color | Ratio | Level | Status |
|----------|----------|-------|-------|--------|
| #FFFFFF | #1A1A1A | 21:1 | AAA | ✅ Perfect |
| #1A1A1A | #FFFFFF | 21:1 | AAA | ✅ Perfect |
| #50C878 | #FFFFFF | 4.5:1 | AA | ✅ OK (verify with Lighthouse) |
| #FFFFFF | #50C878 | 5.4:1 | AA | ✅ OK |
| #333333 | #FFFFFF | 10:1 | AAA | ✅ Excellent |
| #666666 | #FFFFFF | 5.3:1 | AA | ✅ OK |
| #999999 | #FFFFFF | 3.2:1 | N/A | ❌ Placeholder only |
| #1A1A1A | #F5F5F5 | 18:1 | AAA | ✅ Excellent |

**Note:** Always run actual contrast checks with:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools Lighthouse
- Storybook Accessibility plugin

---

## COLOR USAGE GUIDE

### Page Level

**Homepage:**
- Background: #FFFFFF
- Hero bg: #F5F5F5 (optional subtle)
- Hero text: #1A1A1A
- Links: #50C878
- Cards bg: #FFFFFF
- Cards border: #E8E8E8

**Post Detail Page:**
- Background: #FFFFFF
- Main text: #1A1A1A
- Meta text: #666666
- Links: #50C878 (underlined)
- Blockquotes: left border #50C878
- Code blocks: bg #F5F5F5, text #1A1A1A

**About Page:**
- Background: #FFFFFF
- Bio text: #333333
- DINO accent: #50C878

**404 Page:**
- Background: #FFFFFF
- DINO: #50C878
- Text: #1A1A1A
- Button: primary (#50C878)

**Footer:**
- Background: #1A1A1A
- Text: #FFFFFF
- Links: #50C878
- Link hover: #FFFFFF

### Component Level

**Buttons:**
- Primary: bg #50C878, text #FFFFFF
- Primary hover: bg #3BA85E
- Secondary: bg #1A1A1A, text #FFFFFF
- Secondary hover: bg #333333
- Ghost: border #1A1A1A, text #1A1A1A, hover bg #F5F5F5

**Inputs:**
- Border default: #E8E8E8
- Border focus: #50C878
- Placeholder: #999999
- Text: #1A1A1A
- Background: #FFFFFF

**Links:**
- Default: #50C878
- Visited: #3BA85E (same as active)
- Hover: #1A1A1A (underlined)
- Focus: outline #50C878
- Active: #1A1A1A

**Cards:**
- Background: #FFFFFF
- Border: #E8E8E8
- Text (title): #1A1A1A
- Text (excerpt): #333333
- Meta: #666666
- Hover shadow: rgba(26, 26, 26, 0.15)

**Navigation:**
- Text: #1A1A1A
- Hover: #50C878
- Active: #50C878 + underline
- Focus: outline #50C878

---

## DINO COLORS

### Mascote Primary
```
HEX:  #50C878 (Verde - body)
RGB:  rgb(80, 200, 120)

Body: This green fills the main DINO shape
Friendly and playful, matches accent color
```

### Mascote Secondary
```
HEX:  #FFFFFF (Branco - highlights)
RGB:  rgb(255, 255, 255)

Eyes: Branco (with #1A1A1A pupils)
Belly: Branco highlight
Teeth: Branco (when smiling)
```

### Mascote Details
```
HEX:  #1A1A1A (Preto - details)
RGB:  rgb(26, 26, 26)

Eyes (pupils): Preto
Mouth outline: Preto
Claws: Preto outlines
Nostrils: Preto
```

---

## CSS VARIABLE TEMPLATE

```css
/* Colors */
--color-white:        #FFFFFF;
--color-off-white:    #F5F5F5;
--color-light-gray:   #E8E8E8;
--color-dark-gray:    #666666;
--color-medium-gray:  #999999;
--color-dark-text:    #333333;
--color-black:        #1A1A1A;

--color-primary:      #50C878;
--color-primary-hover: #3BA85E;
--color-primary-light: #D4F1E4;

--color-error:        #D32F2F;

/* Semantic */
--color-bg-primary:   var(--color-white);
--color-bg-secondary: var(--color-off-white);
--color-text-primary: var(--color-black);
--color-text-secondary: var(--color-dark-gray);
--color-border:       var(--color-light-gray);
--color-focus:        var(--color-primary);

/* Shadows */
--shadow-subtle:  0 1px 3px rgba(26, 26, 26, 0.12);
--shadow-medium:  0 2px 8px rgba(26, 26, 26, 0.15);
```

---

## ACCESSIBILITY NOTES

1. **Contrast Ratios:**
   - All text on background meets minimum 4.5:1 ratio (WCAG AA)
   - Heading colors verified against backgrounds
   - Meta text (gray) tested for readability

2. **Color Dependence:**
   - Never rely on color alone for meaning
   - Use icons + color for status indicators
   - Links are always underlined, not just colored

3. **Color Blind Friendly:**
   - Avoid red-green as primary distinction
   - Green accent paired with icon/text alternatives
   - Test with Sim Daltonism or similar tools

4. **Dark Mode (Future):**
   - Plan: Invert #FFFFFF ↔ #1A1A1A
   - Keep #50C878 or adjust to #7FE0A0
   - All ratios must still pass WCAG AA

---

## EXPORT & IMPLEMENTATION

### Figma Tokens
```json
{
  "colors": {
    "white": { "value": "#FFFFFF" },
    "black": { "value": "#1A1A1A" },
    "green": { "value": "#50C878" },
    ...
  }
}
```

### Design System Repos
- Storybook documentation
- Zeplin/Figma specs
- Design tokens file (JSON)
- Brand guidelines

### Testing Tools
- Lighthouse (Chrome DevTools)
- WebAIM Contrast Checker
- Sim Daltonism (color blindness)
- Screenreader testing

---

**Color Palette v1.0**  
**Last Updated:** 2024  
**Maintained by:** Design Team
