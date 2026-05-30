/**
 * Returns the list of transport hubs to suggest for a leg, given the selected
 * transport mode plus the trip's selected cities / countries.
 * hubs: HUBS[modeKey] -> country -> city -> [hub]
 * cityPairs: ["Country:City", ...]   countries: ["Country", ...]
 */
export function hubsFor(hubs, modeKey, cityPairs, countries) {
  const byCountry = hubs[modeKey]
  if (!byCountry) return []
  const out = new Set()

  if (cityPairs.length) {
    cityPairs.forEach(pair => {
      const [country, city] = pair.split(':')
      const cityMap = byCountry[country]
      if (cityMap && cityMap[city]) cityMap[city].forEach(h => out.add(h))
    })
    if (out.size) return [...out]
  }

  const keys = countries.length ? countries : Object.keys(byCountry)
  keys.forEach(c => {
    const cityMap = byCountry[c]
    if (cityMap) Object.values(cityMap).forEach(arr => arr.forEach(h => out.add(h)))
  })
  return [...out]
}
