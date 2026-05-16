# OpenShore Design Guide

This document is the single source of truth for building new pages on the OpenShore product analytics platform. Hand it to Claude Code (or any contributor) along with `colors_and_type.css` and you should get pages that feel native to the rest of the product.

If anything here conflicts with `colors_and_type.css`, **the CSS wins** — update this file to match.

---

## 1. What OpenShore is

OpenShore is a developer-first product analytics platform — dashboards, funnels, session replay, and feature flags for engineering and product teams. The audience reads code, runs `curl`, and skims docs. Design with that audience in mind.

**Aesthetic in one line:** dense, hairline-bordered, blue + ink on near-white, sentence case, mono accents — calm and data-first.

---

## 2. Tokens (always use variables, never hex)

All tokens live in `colors_and_type.css` and must be imported on every page:

```html
<link rel="stylesheet" href="/colors_and_type.css">
```

Reference values by their CSS variable. Do **not** paste hex codes inline — if you need a one-off, derive it from a token with `color-mix()`.

### 2.1 Color

| Role | Variable | Value | Use |
|---|---|---|---|
| Page background | `--paper` | `#F7F8FA` | Outer page surface |
| Card / panel | `--canvas` | `#FFFFFF` | Cards, modals, panels |
| Input fill / secondary surface | `--mist` | `#EEF1F6` | Inputs, code chips, hovered ghost buttons |
| Hairline border | `--border` | `#E1E5EC` | 1px borders everywhere |
| Strong border | `--border-strong` | `#C7CDD7` | Secondary buttons, dividers under emphasis |
| Primary text | `--ink` | `#0A0E1A` | Body, headings |
| Secondary text | `--ink-50` | `#5A6173` | Sub-labels, captions, table meta |
| Tertiary / placeholder | `--ink-30` | `#8B92A3` | Placeholders, disabled text |
| **Brand pop** | `--blue-500` | `#2861E6` | Primary buttons, links, active nav, chart cursor |
| Brand hover | `--blue-600` | `#1E4DC9` | Primary button hover |
| Brand pressed | `--blue-700` | `#163FA8` | Pressed state |
| Brand tint | `--blue-50` | `#EAF1FF` | Selected row, active pill background |

**Rules**
- Coverage of `--blue-500` on any screen: **roughly 4–8%**. It's a punctuation color, not a backdrop.
- Deltas (`+18.4%` / `−0.6%`) are **monochrome by default** — use the `↑ / ↓` glyph for direction, not red/green. The system is intentionally not traffic-light.
- No gradients in product UI. None.
- No saturated backgrounds. Surfaces are `--paper`, `--canvas`, or `--mist`.

**Chart palette** (use in this order; never deviate):
`--chart-1` → `--chart-2` → `--chart-3` → `--chart-4` → `--chart-5` → `--chart-6` (blue-500, ink, blue-300, ink-50, blue-700, ink-30).

### 2.2 Type

Two families, loaded from the Google Fonts import in `colors_and_type.css`:

- **Inter Tight** (`--font-sans`) — every piece of UI and prose. Weights 400 / 500 / 600 / 700. Tracking is tight: `-0.01em` body, `-0.02em` headings.
- **JetBrains Mono** (`--font-mono`) — code, IDs, hashes, event names (`pageview`, `sign_up_started`), keyboard shortcuts, table columns containing identifiers. Lean on mono more than typical B2B SaaS — it's a vibe signal.

Use the scale variables (`--fs-xs` 11px → `--fs-display`) and the `.h1 .h2 .h3 .h4 .h-display .body .body-lg .muted .eyebrow .code` utility classes already declared in the stylesheet. **Don't redefine them locally.**

Minimum sizes:
- Body text: **14px** (`--fs-base`)
- Captions / table meta: **12px** (`--fs-sm`)
- Eyebrow / micro-labels: **11px** (`--fs-xs`), uppercase, `letter-spacing: 0.04em`

### 2.3 Spacing, radius, shadow, motion

- **Spacing:** 4px base grid. Use `--sp-1` … `--sp-24`. Tight by default — table rows 8/12, cards 16/20, section gaps 24/32.
- **Radius:** `--r-md` (4px) is the default for buttons, inputs, cards. `--r-lg` (6px) for modals / command palette. `--r-pill` only for avatars and status pills. Sharpness is a brand cue — no big rounded corners.
- **Shadow:** `--shadow-sm` on rare card elevation. `--shadow-pop` only on modals, dropdowns, and the command palette. Borders do the work; shadows are a last resort.
- **Motion:** `--dur-fast` 120ms · `--dur` 180ms · `--dur-slow` 240ms, all with `--ease` (`cubic-bezier(0.2, 0, 0, 1)`). No bounces, no springs, no parallax.

---

## 3. Layout

### 3.1 Product app

- **Sidebar:** 240px fixed left, `--canvas` background, 1px right border (`--border`). Active item gets a `--blue-500` left rail (2px) and `--blue-50` background; label goes `--ink` weight 500.
- **Top bar:** ~52px tall, sticky, 1px bottom border, holds breadcrumbs left + search/cmd-k right.
- **Main content:** flexes to fill. Inner padding 20px. Section gap 16px. Card grids use `gap: 12–16px`.

### 3.2 Marketing / docs / web pages

- **Content rail:** max 1200px, centered, 24px outer gutter.
- **Sticky top nav:** 1px bottom border, no blur, no fade.
- **Section vertical rhythm:** 80–96px between marketing sections; 32–48px between content blocks inside one section.
- **Headings:** lead with `.h-display` for hero, drop to `.h2` for section titles, `.eyebrow` above for category labels.

### 3.3 Page skeleton (copy this for new pages)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>OpenShore — [Page name]</title>
  <link rel="stylesheet" href="/colors_and_type.css">
</head>
<body>
  <!-- top nav (marketing) OR sidebar + topbar (product) -->
  <main class="os-rail">
    <section>
      <span class="eyebrow">Section label</span>
      <h2>Sentence case heading</h2>
      <p class="body-lg muted">One-line subhead. Tight, no fluff.</p>
      <!-- content -->
    </section>
  </main>
</body>
</html>
```

---

## 4. Components

These are the canonical patterns. New pages should reuse, not reinvent.

### 4.1 Buttons

Three variants only. Height **30px** in dense product UI, **36px** in marketing CTAs. 4px radius. 13px Inter Tight 500. Letter-spacing `-0.01em`.

| Variant | Background | Border | Text | Hover |
|---|---|---|---|---|
| Primary | `--blue-500` | `--blue-600` | `#fff` | bg → `--blue-600` |
| Secondary | `--canvas` | `--border-strong` | `--ink` | bg → `--mist`, border → `--ink-50` |
| Ghost | transparent | none | `--ink-70` | bg → `--mist` |

- Press: `transform: translateY(1px)`. No ripples.
- Icon-only buttons are square 30×30, ghost variant, icon centered.
- A button never carries an emoji. Lucide icon at 16px / 1.5px stroke if needed.

### 4.2 Inputs

- Height 30px (dense) or 36px (forms). Background `--mist`. 1px border `--border`. 4px radius. Placeholder `--ink-30`.
- Focus: outline 2px `--blue-500`, offset 2px. Border stays the same.
- Labels above input, `.eyebrow` style, 6px gap.

### 4.3 Cards

`background: var(--canvas); border: 1px solid var(--border); border-radius: 4px; padding: 16–20px;`

- No shadow by default.
- Interactive cards: on hover, border → `--ink-50`, background shifts 1% darker via `color-mix`. No transform.
- Pair an `.eyebrow` label with a large numeric (`--fs-2xl`, weight 700, tracking `-0.02em`) for stat tiles. See `ui_kits/dashboard/StatTile.jsx`.

### 4.4 Tables

- Row height 32px (dense), 40px (regular). 1px row borders `--border`, no zebra striping.
- Column headers: `.eyebrow` style, sticky if scrolling, bottom border `--border-strong`.
- ID / hash / event-name cells render in `--font-mono` at 12px.
- Hover: row background → `--mist`. Click: row background → `--blue-50`.

### 4.5 Status pills

- Pill shape (`--r-pill`), 10/11px text, weight 600, padding `2px 8px`.
- Default: `background: var(--mist); color: var(--ink-70);`
- Active / live: `background: var(--blue-50); color: var(--blue-700);` with a 6px `--blue-500` dot.
- Avoid red/green pills. Use mono text + glyph (`↑ ↓ —`) for direction.

### 4.6 Code & keyboard

- Inline code: `.code` utility — `--mist` background, 1px `--border`, 2px radius, 0.9em mono.
- Keyboard shortcuts: same as inline code, plus a soft inset shadow (`inset 0 -1px 0 var(--border-strong)`).

### 4.7 Links

Already styled in the global CSS: `color: var(--blue-500)`; on hover, 1px bottom border appears in `--blue-500`. **Do not override.** The hover-underline is a brand tell.

### 4.8 Modals / overlays

- Backdrop: flat `--ink` at 40% opacity. No blur.
- Container: `--canvas`, 6px radius, `--shadow-pop`, 24px padding.
- **Only the command palette** uses a 4px backdrop blur — that's the system's entire blur budget.

---

## 5. Iconography

- **Primary set: Lucide** (`https://unpkg.com/lucide@latest`).
- Product UI: **16px, 1.5px stroke**.
- Marketing: **20–24px, 2px stroke**.
- Color: inherit `currentColor`. Active icons follow their text color (usually `--ink` or `--blue-500`).
- No emoji in product chrome. The only Unicode allowed as iconography: `→` in CTA links (`Read the docs →`).
- Custom SVGs (logo, mascot, product diagrams) live in `assets/`. Don't invent new ones — leave a labeled placeholder and flag it.

---

## 6. Imagery

- **No stock photography.** Ever.
- Imagery is one of: (a) monoline product diagrams, (b) mascot illustrations from `assets/`, (c) screenshots of the real product on a `--paper` background.
- If you need an illustration you don't have, render a placeholder block:
  ```html
  <div class="os-placeholder" data-label="Otto holding a clipboard">Otto · clipboard pose</div>
  ```
  Style: dashed `--border-strong`, 4px radius, `--ink-30` mono label centered. Flag it to the user in your handoff.
- Charts always render on `--canvas`, not pure white, and use the chart palette in order.

---

## 7. Voice & content

**Voice:** Direct, unvarnished, a touch wry. We sound like an engineer at a whiteboard, not a marketing team. Say what something does, then optionally crack a joke. Confident, never corporate. Assume the reader can read code.

**Person:** Mostly **"you"** ("you can pipe events…", "you'll see the chart update"). **"We"** is for product opinions ("we think batching by session is the wrong default"). Inside product UI, avoid "users" — say "people" or "visitors".

**Casing:** Sentence case for everything — buttons, headings, table columns. Title Case only for product nouns (Insights, Funnels, Session Replay, Feature Flags). Never ALL CAPS except for `.eyebrow` micro-labels.

**Punctuation:** Real em dashes (—). Oxford commas. Code voice in mono — event names, prop keys, column names. Curly `"…"` in prose, straight `"` in code.

**Numbers:** Abbreviate above 10k (`12.4k`, `1.2M`). Two-decimal precision on percentages (`+18.42%`). Always show direction (`+` / `−`) on deltas.

**Emoji:** Almost never in product UI. Sparingly in marketing/blog — at most one per page, used as punctuation, never as decoration. Never on buttons. Never on charts.

**Examples**
- ✅ "You shipped 14 deploys this week."
- ✅ "No data yet — hit the `/track` endpoint and we'll start filling this in."
- ✅ "Funnels show where people drop off. Set steps. Watch the cliff."
- ❌ "🚀 Welcome to your analytics journey! 🎉"
- ❌ "Our cutting-edge platform empowers data-driven decisions."

---

## 8. Accessibility floor

- Body text ≥ 14px. Captions ≥ 12px.
- Color contrast: `--ink` on `--paper` and `--canvas` clears AAA. `--ink-50` is the lightest text allowed for prose; `--ink-30` is only for placeholders and decorative meta.
- Hit targets ≥ 32×32 in dense UI; ≥ 44×44 on touch surfaces.
- Focus: always `:focus-visible` with the global 2px `--blue-500` outline. Don't suppress.
- Don't encode meaning in color alone — pair red/green substitutes with `↑ ↓` glyphs or labels.

---

## 9. What to do when something isn't covered

1. Look in `ui_kits/dashboard/` and `ui_kits/website/` for an existing pattern.
2. If a primitive is missing, build it from tokens — don't reach for a UI library.
3. If you find yourself adding a hex code, a gradient, a shadow that isn't `--shadow-sm` / `--shadow-pop`, a radius bigger than 6px (outside avatars/pills), or an emoji on a button — **stop and flag it** in your handoff instead of shipping.
4. Less is more. Empty space is a feature. One thousand no's for every yes.

---

## 10. Checklist before merging a new page

- [ ] `colors_and_type.css` is linked; no inline hex codes.
- [ ] Sentence case throughout; product nouns are the only Title Case.
- [ ] Buttons use one of the three canonical variants at the right height.
- [ ] Tables / cards have 1px `--border`, 4px radius, no shadow.
- [ ] Mono is used for event names, IDs, hashes, shortcuts.
- [ ] Deltas show direction with `↑ ↓` glyphs, not color.
- [ ] No gradients. No emoji in chrome. No stock photos.
- [ ] Focus rings visible. Min font-size respected. Hit targets ≥ 32px.
- [ ] Lucide icons at 16/1.5 (product) or 20–24/2 (marketing).
- [ ] Page renders cleanly on `--paper`; cards/panels on `--canvas`.

That's the whole system. Keep it dense, keep it calm, keep it blue-and-ink.
