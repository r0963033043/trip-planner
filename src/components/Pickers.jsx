import { useI18n } from '../lib/i18n.js'
import { CURRENCIES, EXCHANGE_RATES } from '../lib/data.js'

export default function Pickers({ lang, currency, onLang, onCurrency }) {
  const { t } = useI18n()
  return (
    <div className="pickers" style={{ alignItems: 'flex-start' }}>
      <div className="picker-field" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label htmlFor="currency" style={{ margin: 0 }}>{t('currency')}</label>
          <select id="currency" value={currency} onChange={e => onCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="muted-fine">{t('rate_as_of')} {EXCHANGE_RATES.updated}</span>
      </div>
      <div className="picker-field">
        <label htmlFor="lang" style={{ margin: 0 }}>{t('language')}</label>
        <select id="lang" value={lang} onChange={e => onLang(e.target.value)}>
          <option value="en">English</option>
          <option value="zh">繁體中文</option>
        </select>
      </div>
    </div>
  )
}