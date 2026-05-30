import { useEffect, useMemo, useState } from 'react'
import { I18nContext } from './lib/i18n.js'
import { CURRENCIES, getStrings, getLocations, getHubs } from './lib/data.js'
import { hsrFareFor } from './lib/hsr.js'
import Pickers from './components/Pickers.jsx'
import CheckSelect from './components/CheckSelect.jsx'
import EntrySection from './components/EntrySection.jsx'
import TransportFields from './components/TransportFields.jsx'
import StayFields from './components/StayFields.jsx'
import SpotFields from './components/SpotFields.jsx'
import SpeedInfo from './components/SpeedInfo.jsx'
import TotalBar from './components/TotalBar.jsx'

let seq = 0
const nextId = () => ++seq
const makeTransport = () => ({ id: nextId(), mode: '', from: '', to: '', fromTime: '', toTime: '', reservation: '', price: '', priceAutofilled: false })
const makeStay = () => ({ id: nextId(), name: '', address: '', price: '' })
const makeSpot = () => ({ id: nextId(), name: '', price: '' })

const DEFAULT_CURRENCY = CURRENCIES.includes('USD') ? 'USD' : (CURRENCIES[0] || 'USD')

/**
 * Apply the Taiwan HSR fare to a transport leg, or clear a value we previously
 * auto-filled once the leg is no longer a known HSR route in this currency.
 */
function applyHsrAutofill(entry, currency) {
  const fare = entry.mode === 'mode_hsr' ? hsrFareFor(currency, entry.from, entry.to) : null
  if (fare != null) return { ...entry, price: String(fare), priceAutofilled: true }
  if (entry.priceAutofilled) return { ...entry, price: '', priceAutofilled: false }
  return entry
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [transport, setTransport] = useState(() => [makeTransport()])
  const [stay, setStay] = useState(() => [makeStay()])
  const [spot, setSpot] = useState(() => [makeSpot()])
  const [result, setResult] = useState(null)

  const strings = getStrings(lang)
  const t = key => strings[key] ?? key
  const locations = getLocations(lang)
  const hubs = getHubs(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('title')
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // Currency change can switch HSR auto-fill on/off (fares are TWD only).
  useEffect(() => {
    setTransport(prev => prev.map(e => applyHsrAutofill(e, currency)))
  }, [currency])

  const countryItems = Object.keys(locations).map(c => ({ value: c, label: c }))
  const cityPool = countries.length ? countries : Object.keys(locations)
  const cityItems = []
  cityPool.forEach(c => (locations[c] || []).forEach(city => cityItems.push({ value: `${c}:${city}`, label: city, group: c })))

  function onLang(next) {
    // Country/city names are language-specific, so previous picks no longer map.
    setLang(next)
    setCountries([])
    setCities([])
  }

  function onCountries(next) {
    setCountries(next)
    const pool = next.length ? next : Object.keys(locations)
    const valid = new Set()
    pool.forEach(c => (locations[c] || []).forEach(city => valid.add(`${c}:${city}`)))
    setCities(prev => prev.filter(v => valid.has(v)))
  }

  function patchTransport(id, patch) {
    setTransport(prev => prev.map(e => {
      if (e.id !== id) return e
      const next = { ...e, ...patch }
      if ('price' in patch) { next.priceAutofilled = false; return next } // manual edit
      return applyHsrAutofill(next, currency)
    }))
  }
  const patchEntry = setList => (id, patch) =>
    setList(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)))
  const patchStay = patchEntry(setStay)
  const patchSpot = patchEntry(setSpot)

  const total = useMemo(() => (
    [...transport, ...stay, ...spot].reduce((sum, e) => {
      const v = parseFloat(e.price)
      return isNaN(v) ? sum : sum + v
    }, 0)
  ), [transport, stay, spot])

  function onSubmit(e) {
    e.preventDefault()
    const data = {
      lang,
      currency,
      countries,
      cities,
      transport: transport.map((x, i) => ({ no: i + 1, mode: x.mode, from: x.from, to: x.to, fromTime: x.fromTime, toTime: x.toTime, reservation: x.reservation, price: x.price })),
      stay: stay.map((x, i) => ({ no: i + 1, name: x.name, address: x.address, price: x.price })),
      spot: spot.map((x, i) => ({ no: i + 1, name: x.name, price: x.price })),
      total,
    }
    setResult(JSON.stringify(data, null, 2))
  }

  function onReset(e) {
    e.preventDefault()
    setCountries([])
    setCities([])
    setTransport([makeTransport()])
    setStay([makeStay()])
    setSpot([makeSpot()])
    setResult(null)
  }

  return (
    <I18nContext.Provider value={{ lang, t }}>
      <form onSubmit={onSubmit}>
        <div className="top-bar">
          <h1>{t('title')}</h1>
          <Pickers lang={lang} currency={currency} onLang={onLang} onCurrency={setCurrency} />
        </div>

        <h2>{t('location')}</h2>
        <div className="row-top">
          <div>
            <label>{t('country')}</label>
            <CheckSelect items={countryItems} values={countries} onChange={onCountries} placeholder={t('country_placeholder')} />
          </div>
          <div>
            <label>{t('city')}</label>
            <CheckSelect items={cityItems} values={cities} onChange={setCities} grouped placeholder={t('city_placeholder')} />
            <div className="hint">{t('hint_filter')}</div>
          </div>
        </div>

        <EntrySection
          kind="transport"
          heading={t('transportation')}
          headerExtra={<SpeedInfo />}
          entries={transport}
          onAdd={() => setTransport(p => [...p, makeTransport()])}
          onRemove={id => setTransport(p => p.filter(e => e.id !== id))}
          onReorder={setTransport}
          renderFields={e => (
            <TransportFields
              entry={e}
              currency={currency}
              hubs={hubs}
              cities={cities}
              countries={countries}
              onField={patch => patchTransport(e.id, patch)}
            />
          )}
        />

        <EntrySection
          kind="stay"
          heading={t('stay')}
          entries={stay}
          onAdd={() => setStay(p => [...p, makeStay()])}
          onRemove={id => setStay(p => p.filter(e => e.id !== id))}
          onReorder={setStay}
          renderFields={e => <StayFields entry={e} currency={currency} onField={patch => patchStay(e.id, patch)} />}
        />

        <EntrySection
          kind="spot"
          heading={t('spot')}
          entries={spot}
          onAdd={() => setSpot(p => [...p, makeSpot()])}
          onRemove={id => setSpot(p => p.filter(e => e.id !== id))}
          onReorder={setSpot}
          renderFields={e => <SpotFields entry={e} currency={currency} onField={patch => patchSpot(e.id, patch)} />}
        />

        <TotalBar total={total} currency={currency} lang={lang} />

        <div className="actions">
          <button type="reset" onClick={onReset}>{t('reset')}</button>
          <button type="submit" className="btn-submit">{t('save')}</button>
        </div>

        {result != null && <output>{result}</output>}
      </form>
    </I18nContext.Provider>
  )
}
