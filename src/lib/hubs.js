import { getHubs } from './data.js'

/**
 * Returns the localized hub labels to suggest for a leg, given the selected
 * transport mode plus the trip's selected cities / countries.
 * hubs: modeKey -> countryCode -> cityCode -> [{ code, en, zh }]
 * cityPairs: ["countryCode:cityCode", ...]   countries: ["countryCode", ...]
 */
export function hubsFor(hubs, modeKey, cityPairs, countries, lang) {
  const byCountry = hubs[modeKey]
  if (!byCountry) return []
  const out = new Set()
  const add = arr => arr.forEach(h => out.add(h[lang] || h.en))

  if (cityPairs.length) {
    cityPairs.forEach(pair => {
      const [country, city] = pair.split(':')
      const cityMap = byCountry[country]
      if (cityMap && cityMap[city]) add(cityMap[city])
    })
    if (out.size) return [...out]
  }

  const keys = countries.length ? countries : Object.keys(byCountry)
  keys.forEach(c => {
    const cityMap = byCountry[c]
    if (cityMap) Object.values(cityMap).forEach(add)
  })
  return [...out]
}

// Index every hub label (in any language) to its entry, so a From/To value
// typed/picked in one language can be re-rendered in another.
let labelIndex = null
function hubByLabel() {
  if (labelIndex) return labelIndex
  labelIndex = new Map()
  const hubs = getHubs()
  Object.values(hubs).forEach(byCountry =>
    Object.values(byCountry).forEach(byCity =>
      Object.values(byCity).forEach(arr =>
        arr.forEach(h => {
          if (h.en) labelIndex.set(h.en, h)
          if (h.zh) labelIndex.set(h.zh, h)
        }))))
  return labelIndex
}

/**
 * Translate a hub label to `toLang`. Known hubs are mapped via their shared
 * code; free-typed text that matches no hub is returned unchanged.
 */
export function translateHub(label, toLang) {
  const h = hubByLabel().get(label)
  return h ? (h[toLang] || label) : label
}