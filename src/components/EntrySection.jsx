import { useState } from 'react'
import { useI18n } from '../lib/i18n.js'

function reorder(list, fromId, toId) {
  const from = list.findIndex(e => e.id === fromId)
  const to = list.findIndex(e => e.id === toId)
  if (from === -1 || to === -1 || from === to) return list
  const copy = [...list]
  const [moved] = copy.splice(from, 1)
  copy.splice(to, 0, moved)
  return copy
}

/**
 * List of draggable entry cards for one kind (transport / stay / spot).
 * Owns add/remove/reorder/numbering; field rendering is delegated to renderFields.
 */
export default function EntrySection({ kind, heading, headerExtra, entries, onAdd, onRemove, onReorder, renderFields }) {
  const { t } = useI18n()
  const [armedId, setArmedId] = useState(null) // entry whose drag handle is held
  const [dragId, setDragId] = useState(null)

  return (
    <>
      <h2>
        {heading}
        {headerExtra}
        <button type="button" className="btn-add" onClick={onAdd}>{t('add')}</button>
      </h2>
      <div>
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={'entry' + (dragId === entry.id ? ' dragging' : '')}
            draggable={armedId === entry.id}
            onDragStart={() => setDragId(entry.id)}
            onDragEnter={() => {
              if (dragId && dragId !== entry.id) onReorder(reorder(entries, dragId, entry.id))
            }}
            onDragOver={e => e.preventDefault()}
            onDragEnd={() => { setDragId(null); setArmedId(null) }}
            onMouseUp={() => setArmedId(null)}
          >
            <div className="entry-head">
              <div className="entry-head-left">
                <span
                  className="drag-handle"
                  title="Drag to reorder"
                  onMouseDown={() => setArmedId(entry.id)}
                >⋮⋮</span>
                <strong>{t(`entry_${kind}`)} #{i + 1}</strong>
              </div>
              <button type="button" className="btn-remove" onClick={() => onRemove(entry.id)}>
                {t('remove')}
              </button>
            </div>
            {renderFields(entry)}
          </div>
        ))}
      </div>
    </>
  )
}
