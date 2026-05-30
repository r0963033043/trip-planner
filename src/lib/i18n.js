import { createContext, useContext } from 'react'

// Provides the active language and a translate function `t(key)` to the tree.
export const I18nContext = createContext({ lang: 'en', t: key => key })

export const useI18n = () => useContext(I18nContext)
