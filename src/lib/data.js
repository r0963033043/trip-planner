/** Central place that bundles the JSON data and exposes per-language lookups.
 * Places and hubs are keyed by language-independent codes; the active language
 * only decides which label is shown, so selections survive a language switch.
 */
import enUS from '../locales/en-US.json'
import zhTW from '../locales/zh-TW.json'

import places from '../data/places.json'
import hubs from '../data/transport-hubs.json'

import currencies from '../data/currencies.json'
import hsrFares from '../data/hsr-fares.json'
import exchangeRates from '../data/exchange-rates.json'

const STRINGS = { en: enUS, zh: zhTW }
const label = (obj, lang) => obj[lang] || obj.en

export const MODE_KEYS = [
  'mode_airplane', 'mode_hsr', 'mode_train', 'mode_metro', 'mode_light_rail',
  'mode_bus_long', 'mode_bus_short', 'mode_ferry', 'mode_car',
]

export const RAIL_MODES = ['mode_hsr', 'mode_train', 'mode_metro', 'mode_light_rail']

export const CURRENCY_USD = 'USD'
export const CURRENCIES = currencies.map(c => c.code)

const CURRENCY_DECIMALS = Object.fromEntries(currencies.map(c => [c.code, c.decimals]))
export const decimalsFor = code => CURRENCY_DECIMALS[code] ?? 2

export const HSR_FARES = hsrFares
export const EXCHANGE_RATES = exchangeRates

export function getStrings(lang) { return STRINGS[lang] || STRINGS.en }

// Code-keyed hub dataset: mode -> countryCode -> cityCode -> [{ code, en, zh }].
export function getHubs() { return hubs }

// Selectable countries for the active language: [{ value: code, label }].
export function getCountryItems(lang) {
  return Object.entries(places).map(([code, c]) => ({ value: code, label: label(c, lang) }))
}

// Selectable cities (optionally limited to some country codes), grouped by
// country. Value is the language-independent `countryCode:cityCode` pair.
export function getCityItems(lang, countryCodes) {
  const pool = countryCodes && countryCodes.length ? countryCodes : Object.keys(places)
  const items = []
  pool.forEach(cc => {
    const c = places[cc]
    if (!c) return
    Object.entries(c.cities).forEach(([code, city]) =>
      items.push({ value: `${cc}:${code}`, label: label(city, lang), group: label(c, lang) }))
  })
  return items
}

// The set of valid `countryCode:cityCode` values for a country selection,
// used to drop city picks once their country is deselected.
export function validCityValues(countryCodes) {
  const pool = countryCodes && countryCodes.length ? countryCodes : Object.keys(places)
  const out = []
  pool.forEach(cc => {
    const c = places[cc]
    if (c) Object.keys(c.cities).forEach(code => out.push(`${cc}:${code}`))
  })
  return out
}
