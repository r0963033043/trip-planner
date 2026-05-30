import { useI18n } from '../lib/i18n.js'
import { priceStepFor } from '../lib/money.js'

export default function PriceField({ value, currency, onChange }) {
  const { t } = useI18n()
  return (
    <div className="price-col">
      <label>{t('price')} ({currency})</label>
      <input
        type="number"
        min="0"
        step={priceStepFor(currency)}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}