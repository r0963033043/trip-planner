# Trip Planner

A React + Vite trip planner. Pick countries and cities, then add transport legs, stays, and spots to build a structured itinerary.

**Live:** <https://r0963033043.github.io/trip-planner/>

## Development

```
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project layout

```
index.html                  Vite entry; mounts <div id="root">
vite.config.js              Vite config (base "./" for GitHub Pages subpaths)
src/
  main.jsx                  React entry — renders <App>
  App.jsx                   Top-level state, i18n provider, layout
  styles.css                Global styles (dark theme)
  lib/
    data.js                 Bundles JSON; exposes per-language lookups + constants
    i18n.js                 I18nContext + useI18n() (t() translate helper)
    money.js                Currency formatting + price input step
    hubs.js                 Hub suggestions for a transport leg
    hsr.js                  Taiwan THSR fare lookup (TWD only)
  components/
    Pickers.jsx             Language + currency selects
    CheckSelect.jsx         Grouped multi-select checkbox dropdown
    EntrySection.jsx        Add/remove/drag-reorder list for one entry kind
    TransportFields.jsx     Transport leg fields (+ hub datalists)
    StayFields.jsx          Stay fields
    SpotFields.jsx          Spot fields
    PriceField.jsx          Shared currency-labelled price input
    SpeedInfo.jsx           Rail-speed reference tooltip
    TotalBar.jsx            Running total
  data/
    locations-*.json        Country -> [city]
    transport-hubs-*.json   Mode -> country -> city -> [hub]
    currencies.json         [{ code, decimals }]
    hsr-fares.json          Taiwan THSR standard-car fares (TWD); auto-fills HSR price
  locales/
    en-US.json
    zh-TW.json
```

## Features

- Country / city multi-select with grouped checkbox picker
- Transport, stay, and spot entries — add, remove, drag to reorder
- Transport modes: airplane, HSR, train, metro, light rail, long-distance & city bus, ferry, car
- Hub autocomplete filtered by selected cities or countries
- Per-trip currency with currency-aware decimals and running total
- Taiwan HSR price auto-fill from the official fare table (when currency is TWD)
- English and Traditional Chinese UI and data
- Submit renders the trip as JSON in the page

## Deployment

Build with `npm run build` and serve the `dist/` output. Published to the
`gh-pages` branch via GitHub Pages; `base: "./"` keeps asset paths relative so
it works from the project subpath.
