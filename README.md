# Trip Planner

A static, browser-only trip planner. Pick countries and cities, then add transport legs, stays, and spots to build a structured itinerary.

**Live:** <https://r0963033043.github.io/trip-planner/>

## Project layout

```
index.html          Landing page
plan-form.html      Main form (UI + logic inline)
api/
  i18n.js           Loads i18n/<lang>.json
  locations.js      Loads db/locations-*.json and db/transport-hubs-*.json
db/
  locations-*.json       Country -> [city]
  transport-hubs-*.json  Mode -> country -> city -> [hub]
i18n/
  en-US.json
  zh-TW.json
```

## Features

- Country / city multi-select with grouped checkbox picker
- Transport, stay, and spot entries — add, remove, drag to reorder
- Transport modes: airplane, HSR, train, metro, light rail, bus, ferry, car
- Hub autocomplete filtered by selected cities or countries
- English and Traditional Chinese UI and data
- Submit renders the trip as JSON in the page

## Deployment

Served from the `gh-pages` branch via GitHub Pages.