import { decimalsFor } from './data.js'

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
