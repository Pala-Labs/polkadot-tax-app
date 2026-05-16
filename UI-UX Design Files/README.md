# OpenShore Design System

OpenShore is a developer-first **product analytics platform** — dashboards, funnels, session replay, and feature flags for engineering and product teams. Think "the open analytics layer for your product." The brand voice is direct, transparent, and a little wry — closer to a hacker-friendly tool than enterprise SaaS.

The design language is **calm, dense, and data-first**: a near-white page surface, white cards on top, hairline borders doing the layout work, a single punchy blue accent, and liberal use of monospace for anything that smells like code. Sharp 4px corners. No gradients. No stock photography. Sentence case throughout.

> **Looking for the implementation rules?** See `design.md` at the project root — it's the practical guide written for Claude Code and contributors. This README explains *why* the system looks the way it does; `design.md` tells you *how* to build with it.

---

## Index

```
README.md                    ← you are here (philosophy + map)
design.md                    ← practical guide for shipping new pages
colors_and_type.css          ← all color + type tokens (root truth)
assets/
  logo-wordmark.svg          ← "openshore" wordmark
  logo-mark.svg              ← bracket-wave mark only
  otto-wave.svg              ← Otto the paper boat (hero pose)
  otto-think.svg             ← Otto thinking pose
  otto-celebrate.svg         ← Otto celebrating
  pattern-grid.svg           ← faint grid background tile
preview/                     ← Design System tab cards (registered as assets)
ui_kits/
  dashboard/                 ← analytics product app — sidebar, insights, funnels, session list
  website/                   ← marketing site — hero, pricing, docs nav
```

If you have access to a real OpenShore Figma or codebase, drop it in via the Import menu and we'll re-anchor everything.

---

## Content fundamentals

**Voice:** Direct, unvarnished, slightly wry. We sound like an engineer at a whiteboard, not a marketing team. We say what something *does*, then optionally crack a joke.

**Person:** Mostly **"you"** ("you can pipe events…", "you'll see the chart update"). **"We"** is reserved for opinions and product decisions ("we think batching by session is the wrong default"). Avoid "users" inside product UI — it's "people" or "visitors" depending on context.

**Casing:** Sentence case for everything — buttons, headings, table columns. Title Case is reserved for product nouns (Insights, Funnels, Session Replay, Feature Flags). Never ALL CAPS except for tiny labels (≤11px) and section eyebrow text in marketing.

**Punctuation:** Real em dashes (—). Oxford commas. Code voice in `monospace` — table column names, event names, prop keys all live in mono. Quotes are straight `"` in code, curly `"` in prose.

**Numbers:** Always abbreviated above 10k — `12.4k`, `1.2M`. Two-decimal precision for percentages (`+18.42%`). Always show direction (`+`/`−`) on deltas. Deltas are **monochrome** by default — direction is carried by the glyph (`↑ ↓`), not by red/green.

**Emoji:** Almost never in product UI. Sparingly in marketing/blog (think 1 per page, used as a punctuation device, not decoration). Never on buttons, never on charts.

**Examples:**
- ✅ "You shipped 14 deploys this week."
- ✅ "No data yet — hit the `/track` endpoint and we'll start filling this in."
- ✅ "Funnels show where people drop off. Set steps. Watch the cliff."
- ❌ "🚀 Welcome to your analytics journey! 🎉"
- ❌ "Our cutting-edge platform empowers data-driven decisions."

**Vibe:** Smart friend who built the thing, not a salesperson selling it. Confident, never corporate. We assume you can read code.

---

## Visual foundations

**Surface palette.** Three near-whites do most of the work:
- `--paper` `#F7F8FA` — primary page background
- `--canvas` `#FFFFFF` — app surface (cards, panels, modals)
- `--mist` `#EEF1F6` — secondary surface (input fills, code chips, hovered ghost buttons)

Pure white reads cool and clinical; `--paper` introduces just enough warmth to feel calm. `--canvas` cards sit on `--paper` and are separated by 1px borders rather than shadows.

**Ink.** Text is a near-black `--ink` `#0A0E1A`, stepped down through `--ink-70`, `--ink-50` (secondary text), `--ink-30` (placeholders), `--ink-15` (decorative). Body prose never goes lighter than `--ink-50`.

**Brand pop.** A single signature accent: **`--blue-500` `#2861E6`**. Used sparingly — primary CTAs, links (with the hover-underline tell), active sidebar items, the cursor in charts, the dot on live status pills. **Roughly 4–8% coverage of any screen — never more.** The blue scale extends in both directions (`--blue-50` tints for selected rows; `--blue-700` for pressed states) but coverage rules still apply.

The system is **intentionally monochrome for state**: deltas, positive/negative numbers, and trend arrows all render in `--ink` with a direction glyph. We don't do traffic-light dashboards. This is a deliberate choice — it forces the chart, the number, and the label to carry meaning instead of color.

**Chart palette.** Cycles through `--chart-1` … `--chart-6`: blue-500 → ink → blue-300 → ink-50 → blue-700 → ink-30. Use in order; never deviate.

**Type.** Two families:
- **Inter Tight** for everything — UI, marketing, headings. Weights 400 / 500 / 600 / 700. Tracking is tight: `-0.01em` body, `-0.02em` headings.
- **JetBrains Mono** for code, table cells with IDs/hashes, event names, keyboard shortcuts. Monospace acts as a *vibe* signal — "this is a developer tool" — so we use it more liberally than most B2B SaaS would.

**Spacing.** 4px base grid. Common steps: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Tight by default — this is a data tool, not a meditation app. Table row padding is 8/12; card padding is 16/20.

**Backgrounds.** Mostly flat `--paper`. No gradients in product UI. No saturated color blocks. The dotted `pattern-grid.svg` (~6% opacity) can sit behind marketing hero zones and empty states; that's the only background texture in the system. No stock photography anywhere — imagery is mascot illustration, monoline product diagrams, or screenshots of the actual product.

**Illustration.** Monoline — single-weight black stroke (1.5–2px), light neutral fill for Otto's body, white interior highlights. Hand-drawn-feeling but geometrically clean. Otto can hold props (a clipboard, a chart, a question mark). Never AI-generated. If we don't have an Otto pose for the situation, **use a placeholder**, don't invent one.

**Animation.** Honest and quick. 120–180ms for state changes (`cubic-bezier(0.2, 0, 0, 1)`). 240ms max for layout transitions. **No bounces, no springs, no parallax.** Charts animate in once on first paint (350ms ease-out, value-up); they do not re-animate on filter changes — the data updates in place. Hovering a button shifts its background by ~6% darkness; that's it.

**Hover/press.** Hover = background shifts ~6% darker (`color-mix(in oklab, currentColor 6%, transparent)`) or steps to the next surface (`--canvas` → `--mist`). Press = `transform: translateY(1px)` and a slightly deeper shift. No elaborate ripples. The brand's signature tell: *a blue 1px underline appears on hover for any text link.*

**Borders.** 1px hairlines, almost always `--border` `#E1E5EC` on light surfaces; `--border-strong` `#C7CDD7` for emphasis (secondary button outlines, table header underlines). Borders do most of the layout work — shadows are a last resort. Focus rings are 2px `--blue-500` with a 2px offset.

**Shadows.** Two only:
- `--shadow-sm` `0 1px 2px rgba(10,14,26,0.06)` — subtle elevation on cards (rarely used; borders preferred).
- `--shadow-pop` `0 8px 24px rgba(10,14,26,0.14), 0 2px 6px rgba(10,14,26,0.08)` — modals, dropdowns, command palettes only.

**Radii.** 0px (chips/inputs in some dense contexts) / **4px** (default — buttons, inputs, cards) / 6px (modals, command palette) / 9999px (avatars, status pills only). **No big rounded corners.** Sharpness is a brand cue.

**Cards.** `--canvas` on `--paper`, 1px border (`--border`), 4px radius, 16–20px padding, no shadow by default. Hovering an *interactive* card lifts the border to `--ink-50` and shifts the background 1% — no transform.

**Layout rules.** App uses a **240px fixed sidebar** + fluid main; marketing uses a **1200px max content rail** with a 24px outer gutter. The marketing top nav is **sticky with a 1px bottom border** — it does not blur or fade.

**Transparency / blur.** Almost never. We don't use frosted glass. Modal backdrops are flat `--ink` at 40% opacity. The one exception: the command palette uses a 4px backdrop blur — that's the entire usage.

**Imagery vibe.** Calm and clean. The whole system tilts cool-neutral, not warm. Charts and screenshots render on `--canvas`, never pure white in isolation. Photographs (rare) should be flat-lit and uncluttered. No corporate stock; if we need a "team" photo, use a mascot scene instead.

---

## Iconography

**Primary set: Lucide** (loaded from CDN, `lucide@latest`). Lucide is a fork of Feather, monoline, 1.5px stroke, 24px grid — matches the brand's geometric-but-friendly vibe. We use the **default 1.5px stroke at 16px** in product UI (sidebar, table actions, buttons) and **2px stroke at 20–24px** in marketing.

**SVG mascots and product icons** live in `assets/` as standalone SVGs — Otto poses, the wordmark, the bracket mark. They are *not* part of Lucide; they are bespoke brand art.

**Emoji:** Only in informal channels (changelog blurbs, Slack-style notifications inside the app). Never in product chrome. Never in charts.

**Unicode as icons:** Avoided. The two exceptions: `→` in CTA links ("Read the docs →"), and `↑ / ↓` for delta direction. Both are brand tells.

**Logos / mascots in repo:**
- `assets/logo-wordmark.svg` — full "openshore" wordmark, ink color, brackets accented blue
- `assets/logo-mark.svg` — square mark only, suitable for favicons / app icons
- `assets/otto-wave.svg`, `otto-think.svg`, `otto-celebrate.svg` — three Otto (paper-boat mascot) poses
- `assets/pattern-grid.svg` — subtle dotted grid background tile

If you need an Otto pose we don't have, leave a labeled placeholder rather than generating one — the brand is precious about mascot illustration.

---

## Building new pages

Read `design.md`. It's the operational guide — tokens, components, layout shells, voice rules, and a pre-merge checklist — written specifically for handoff to Claude Code. This README sets the philosophy; `design.md` enforces it.
