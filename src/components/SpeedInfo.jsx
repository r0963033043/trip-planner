import { Fragment } from 'react'
import { useI18n } from '../lib/i18n.js'
import { RAIL_MODES } from '../lib/data.js'

// "i" info icon with a hover/focus tooltip listing rail-mode speed references.
export default function SpeedInfo() {
  const { t } = useI18n()
  return (
    <span className="info-icon" tabIndex={0} aria-label="Speed reference">
      i
      <span className="tooltip">
        <dl>
          {RAIL_MODES.map(k => (
            <Fragment key={k}>
              <dt>{t(k)}</dt>
              <dd>{t('speed_' + k.replace(/^mode_/, ''))}</dd>
            </Fragment>
          ))}
        </dl>
      </span>
    </span>
  )
}