import { useI18n } from '../lib/i18n.js'
import { MODE_KEYS, HSR_FARES, EXCHANGE_RATES } from '../lib/data.js'
import { hubsFor } from '../lib/hubs.js'
import { hsrNativeFareFor } from '../lib/hsr.js'
import { formatMoney, convert } from '../lib/money.js'
import PriceField from './PriceField.jsx'

export default function TransportFields({ entry, currency, hubs, cities, countries, onField }) {
  const { t, lang } = useI18n()
  const fromId = `hubs-from-${entry.id}`
  const toId = `hubs-to-${entry.id}`
  const options = hubsFor(hubs, entry.mode, cities, countries, lang)

  /**
   * When the chosen currency differs from the fare currency the price can't be
   * auto-filled, so surface the native HSR fare and its converted equivalent.
   */
  const nativeFare = entry.mode === 'mode_hsr' && currency !== HSR_FARES.currency
    ? hsrNativeFareFor(entry.from, entry.to)
    : null
  let priceHint = null
  if (nativeFare) {
    const converted = convert(nativeFare.fare, nativeFare.currency, currency)
    priceHint = (
      <>
        {formatMoney(nativeFare.fare, nativeFare.currency, lang)}
        {converted != null && ` ≈ ${formatMoney(converted, currency, lang)}`}
        <br />
        <span className="muted-fine">{t('rate_as_of')} {EXCHANGE_RATES.updated}</span>
      </>
    )
  }

  return (
    <div className="row">
      <div className="row-main">
        <div>
          <label>{t('mode')}</label>
          <select required value={entry.mode} onChange={e => onField({ mode: e.target.value })}>
            <option value="">{t('select_placeholder')}</option>
            {MODE_KEYS.map(k => <option key={k} value={k}>{t(k)}</option>)}
          </select>
        </div>
        <div>
          <label>{t('from')}</label>
          <input
            type="text"
            list={fromId}
            required
            value={entry.from}
            onChange={e => onField({ from: e.target.value })}
          />
          <datalist id={fromId}>
            {options.map(h => <option key={h} value={h} />)}
          </datalist>
        </div>
        <div>
          <label>{t('to')}</label>
          <input
            type="text"
            list={toId}
            required
            value={entry.to}
            onChange={e => onField({ to: e.target.value })}
          />
          <datalist id={toId}>
            {options.map(h => <option key={h} value={h} />)}
          </datalist>
        </div>
        <div>
          <label>{t('from_time')}</label>
          <input type="datetime-local" value={entry.fromTime} onChange={e => onField({ fromTime: e.target.value })} />
        </div>
        <div>
          <label>{t('to_time')}</label>
          <input type="datetime-local" value={entry.toTime} onChange={e => onField({ toTime: e.target.value })} />
        </div>
        <div>
          <label>{t('no')}</label>
          <input type="text" placeholder={t('reservation')} value={entry.reservation} onChange={e => onField({ reservation: e.target.value })} />
        </div>
      </div>
      <PriceField value={entry.price} currency={currency} onChange={v => onField({ price: v })} hint={priceHint} />
    </div>
  )
}