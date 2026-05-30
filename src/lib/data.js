// Central place that bundles the JSON data and exposes per-language lookups.
import enUS from '../locales/en-US.json'
import zhTW from '../locales/zh-TW.json'

import locationsEn from '../data/locations-en.json'
import locationsZh from '../data/locations-zh.json'

import hubsEn from '../data/transport-hubs-en.json'
import hubsZh from '../data/transport-hubs-zh.json'

import currencies from '../data/currencies.json'
import hsrFares from '../data/hsr-fares.json'

const STRINGS = { en: enUS, zh: zhTW }
const LOCATIONS = { en: locationsEn, zh: locationsZh }
const HUBS = { en: hubsEn, zh: hubsZh }

export const MODE_KEYS = [
  'mode_airplane', 'mode_hsr', 'mode_train', 'mode_metro', 'mode_light_rail',
  'mode_bus_long', 'mode_bus_short', 'mode_ferry', 'mode_car',
]

export const RAIL_MODES = ['mode_hsr', 'mode_train', 'mode_metro', 'mode_light_rail']

export const CURRENCIES = currencies.map(c => c.code)

const CURRENCY_DECIMALS = Object.fromEntries(currencies.map(c => [c.code, c.decimals]))
export const decimalsFor = code => CURRENCY_DECIMALS[code] ?? 2

export const HSR_FARES = hsrFares

export function getStrings(lang) { return STRINGS[lang] || STRINGS.en }
export function getLocations(lang) { return LOCATIONS[lang] || LOCATIONS.en }
export function getHubs(lang) { return HUBS[lang] || HUBS.en }
