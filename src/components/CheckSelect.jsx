import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n.js'

/**
 * Multi-select dropdown with checkboxes. Controlled via `values` / `onChange`.
 * items: [{ value, label, group? }]. When `grouped`, items are bucketed by group.
 */
export default function CheckSelect({ items, values, onChange, grouped = false, placeholder = '' }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = e => { if (!rootRef.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = new Set(values)
  const toggle = value => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange([...next])
  }

  const summaryLabels = items.filter(i => selected.has(i.value)).map(i => i.label)
  const summaryText = summaryLabels.length ? summaryLabels.join(', ') : placeholder

  const renderItem = i => (
    <label key={i.value} className="check-select-item">
      <input type="checkbox" checked={selected.has(i.value)} onChange={() => toggle(i.value)} />
      <span>{i.label}</span>
    </label>
  )

  let panelContent
  if (!items.length) {
    panelContent = <div className="check-select-empty">{t('empty_panel')}</div>
  } else if (grouped) {
    const groups = new Map()
    items.forEach(i => {
      if (!groups.has(i.group)) groups.set(i.group, [])
      groups.get(i.group).push(i)
    })
    panelContent = [...groups.entries()].map(([g, list]) => (
      <div key={g}>
        <div className="check-select-group-label">{g}</div>
        {list.map(renderItem)}
      </div>
    ))
  } else {
    panelContent = items.map(renderItem)
  }

  return (
    <div className="check-select" ref={rootRef}>
      <button
        type="button"
        className="check-select-trigger"
        aria-expanded={open}
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
      >
        <span className={'check-select-summary' + (summaryLabels.length ? '' : ' muted')}>
          {summaryText}
        </span>
        <span className="check-select-caret">▾</span>
      </button>
      {open && <div className="check-select-panel">{panelContent}</div>}
    </div>
  )
}
