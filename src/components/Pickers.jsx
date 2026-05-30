import { useI18n } from '../lib/i18n.js'
import { CURRENCIES } from '../lib/data.js'

export default function Pickers({ lang, currency, onLang, onCurrency }) {
  const { t } = useI18n()
  return (
    <div className="pickers">
      <div className="lang-picker">
        <label htmlFor="currency" style={{ margin: 0 }}>{t('currency')}</label>
        <select id="currency" value={currency} onChange={e => onCurrency(e.target.value)}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="lang-picker">
        <label htmlFor="lang" style={{ margin: 0 }}>{t('language')}</label>
        <select id="lang" value={lang} onChange={e => onLang(e.target.value)}>
          <option value="en">English</option>
          <option value="zh">繁體中文</option>
        </select>
      </div>
    </div>
  )
}