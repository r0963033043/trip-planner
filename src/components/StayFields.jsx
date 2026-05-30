import { useI18n } from '../lib/i18n.js'
import PriceField from './PriceField.jsx'

export default function StayFields({ entry, currency, onField }) {
  const { t } = useI18n()
  return (
    <div className="row">
      <div className="row-main">
        <div>
          <label>{t('name')}</label>
          <input type="text" required value={entry.name} onChange={e => onField({ name: e.target.value })} />
        </div>
        <div>
          <label>{t('address')}</label>
          <input type="text" value={entry.address} onChange={e => onField({ address: e.target.value })} />
        </div>
      </div>
      <PriceField value={entry.price} currency={currency} onChange={v => onField({ price: v })} />
    </div>
  )
}