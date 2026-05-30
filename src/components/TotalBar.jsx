import { useI18n } from '../lib/i18n.js'
import { formatMoney } from '../lib/money.js'

export default function TotalBar({ total, currency, lang }) {
  const { t } = useI18n()
  return (
    <div className="total-bar">
      <span className="total-label">{t('total')}</span>
      <span className="total-amount">{formatMoney(total, currency, lang)}</span>
    </div>
  )
}