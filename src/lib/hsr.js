import { HSR_FARES } from './data.js'

/**
 * Look up the Taiwan HSR standard-car fare for a leg in its native currency
 * (HSR_FARES.currency, TWD), ignoring the chosen currency. Returns
 * { fare, currency }, or null if it is not a known HSR route.
 */
export function hsrNativeFareFor(from, to) {
  const a = HSR_FARES.stations[(from || '').trim()]
  const b = HSR_FARES.stations[(to || '').trim()]
  if (!a || !b || a === b) return null
  const fare = HSR_FARES.fares[`${a}-${b}`] ?? HSR_FARES.fares[`${b}-${a}`]
  return fare == null ? null : { fare, currency: HSR_FARES.currency }
}
