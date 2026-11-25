# @asya/web-design — how to build with this design system

This is the **Asya** design system (`@asya/web-design`), a React + MUI component library. All components render from `window.AsyaWebDesign.*` (the bundle is loaded from the root `_ds_bundle.js`). Build screens by composing these real components — do not hand-roll buttons, inputs, or fields.

## Required wrapper — nothing is styled without it

Wrap the **entire** tree in `AsyaThemeProvider`. Components read their theme (colors, typography, spacing) and Russian date-picker localization from this context; without it they render unstyled or throw a missing-context error.

```jsx
const { AsyaThemeProvider, Button, TextField, Select } = window.AsyaWebDesign;

<AsyaThemeProvider>
  {/* your screen */}
  <Button color="accent" variant="primary">Сохранить</Button>
</AsyaThemeProvider>
```

`AsyaThemeProvider` already includes the localization provider (date/time pickers work with Russian locale out of the box). Do not add your own MUI `ThemeProvider` or `LocalizationProvider` — it would shadow the Asya theme.

## The styling idiom — props, not CSS classes

This is a **CSS-in-JS** system (MUI + emotion). There is **no utility-class vocabulary** — do not write `className="bg-..."` or invent token classes; they will not resolve. Style components through their **props**, and do your own layout glue with inline `style` or a plain wrapper `div` using fl/flex.

Design-language props carried by the components:
- **Color/tone**: `color="accent"` (brand pink/малиновый) vs `color="neutral"`. Buttons and IconButtons use this; ListItem uses `neutral | accent | danger`.
- **Variant**: Button — `primary | outline | secondary | ghost`. Chip/other components expose their own variant/state props (`active`, `disabled`, `error`).
- **Size**: most components take `size="l" | "m" | "s"` (Avatar takes a numeric pixel size).
- **State**: `disabled`, `loading` (Button shows a spinner), `error` (fields show the red variant), `active`/`checked` where applicable.

Brand accent color is a magenta/pink (малиновый). Neutral is grey. The brand font is **Graphik LCG** — it ships with the bundle; you do not need to import it.

## Design tokens (`tokens/tokens.css`)

The full Asya token system ships as CSS custom properties in `tokens/tokens.css` (imported by `styles.css`). Prefer styling through component **props** — but when you write your own layout glue, use these tokens instead of hard-coded values so it stays on-brand.

- **Colors — use directly.** Valid CSS values, e.g. `background: var(--semantic-colors-backgrounds-bg-main)` (`#f9f4f4`), brand accent `var(--semantic-colors-backgrounds-bg-primary-default)` (`#d6006d`, малиновый), plus surface-level-1/2/3, system success/warning/error, neutral, etc.
- **Dimensions (spacing / radius / sizing / font-size / line-height) are UNITLESS numbers by design** — e.g. `--primitive-spacing-spacing-100` is `8`, not `8px`. The design system consumes them by multiplying in `calc`: write `padding: calc(var(--primitive-spacing-spacing-100) * 1px)`, NOT `padding: var(--primitive-spacing-spacing-100)` (which renders the invalid `8` and is ignored). If in doubt, just use plain `px` for your own spacing — the components already carry the correct internal spacing.

## Where the truth lives

- Per-component API + usage: read `components/<group>/<Name>/<Name>.prompt.md` and `<Name>.d.ts` before styling that component. Groups: `components/` (Avatar, Button, Checkbox, Chip, IconButton, ListItem, Paper, Switch) and `fields/` (Select, TextField).
- Each `<Name>.html` shows the component's real variants rendered from the bundle — look there to see what a variant actually produces.

## One idiomatic example

```jsx
const { AsyaThemeProvider, TextField, Select, Button } = window.AsyaWebDesign;

<AsyaThemeProvider>
  <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
    <TextField label="ФИО пациента" helperText="Как в паспорте" />
    <Select label="Тип приёма" size="m" />
    <div style={{ display: "flex", gap: 8 }}>
      <Button color="accent" variant="primary">Записать</Button>
      <Button color="neutral" variant="outline">Отмена</Button>
    </div>
  </div>
</AsyaThemeProvider>
```

Layout (the flex column, the gaps) is your own glue with inline styles; the controls are always Asya components styled through props.

# AsyaWebDesign (@asya/web-design@0.17.0)

This design system is the published @asya/web-design React library, bundled as a single
browser global. All 34 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.AsyaWebDesign`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry (tokens and fonts; this DS injects component styles at runtime). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.AsyaWebDesign.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { ActionModal } = window.AsyaWebDesign;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<ActionModal />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<AsyaThemeProvider><AsyaLocalizationProvider>{children}</AsyaLocalizationProvider></AsyaThemeProvider>
```

## Tokens

807 CSS custom properties from @asya/tokens. Names are
preserved verbatim from upstream. See `tokens/` for the full list.

- **color** (459): `--primitive-colors-pink-50`, `--primitive-colors-pink-100`, `--primitive-colors-pink-200`, …
- **spacing** (195): `--semantic-sizing-gap-gap-xs`, `--semantic-sizing-gap-gap-s`, `--semantic-sizing-gap-gap-l`, …
- **typography** (71): `--typeface-title-font-family`, `--typeface-body-font-family`, `--typeface-weight-font-weight-regular`, …
- **radius** (39): `--primitive-radius-radius-050`, `--primitive-radius-radius-100`, `--primitive-radius-radius-200`, …
- **shadow** (12): `--semantic-sizing-shadow-shadow-100-position-x-shadow-100`, `--semantic-sizing-shadow-shadow-100-position-y-shadow-100`, `--semantic-sizing-shadow-shadow-100-blur-shadow-100`, …
- **other** (31): `--primitive-spacing-spacing-050`, `--primitive-spacing-spacing-100`, `--primitive-spacing-spacing-200`, …

## Components

### components
- `ActionModal` —  :   ,     .   
- `Avatar`
- `Breadcrumbs`
- `Button`
- `Checkbox` —   (Figma Checkbox, node 452:965).   MUI Checkbox.
- `Chip`
- `CircularProgress`
- `CounterBadge`
- `Drawer`
- `FabMenu`
- `IconButton`
- `ListItem`
- `Menu`
- `Modal`
- `Paper`
- `Popover`
- `Radio`
- `SegmentedControl` —   (Figma Segmented control, node 255:1330).  
- `SidePanel` —   (Figma Floating panel):  tablet     
- `SignalBadge`
- `Skeleton`
- `Slider` —    number slider ( min/max   ).   MUI
- `Switch` —  toggle-switch (base- Figma, node 70:52, size S).   2812 (pill)
- `Tabs` — Underline tab bar (presentational).  roletablist   roletab
- `Tooltip`
- `Typography`

### fields
- `Autocomplete`
- `DatePicker` —   date.  
- `DateTimePicker` — -  datetime.   ( 
- `SearchField` —   (Figma Search field). TextField        
- `Select` —   (single/multi)  enum / enum_array dropdown.  
- `TextField` —    (Figma Input, node 275:2742).   MUI TextField:
- `TimePicker` —   time.  

### misc
- `Table`
