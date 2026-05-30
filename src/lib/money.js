import { decimalsFor, EXCHANGE_RATES } from './data.js'

/**
 * Convert an amount between currencies using the bundled exchange rates.
 * Rates are expressed as units of each currency per 1 unit of the base, so we
 * route through the base. Returns null when either currency has no rate.
 */
export function convert(amount, from, to) {
  if (from === to) return amount
  const { rates } = EXCHANGE_RATES
  if (rates[from] == null || rates[to] == null) return null
  return (amount / rates[from]) * rates[to]
}

export function formatMoney(amount, currency, lang) {
  const d = decimalsFor(currency)
  try {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
      style: 'currency', currency, minimumFractionDigits: d, maximumFractionDigits: d,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(d)}`
  }
}

export function priceStepFor(currency) {
  return decimalsFor(currency) === 0 ? '1' : '0.01'
}
