import { createI18n, useI18n as useVueI18n } from 'vue-i18n'
import { pl } from './locales/pl'
import { en } from './locales/en'

export const SUPPORTED_LOCALES = ['en', 'pl']
const FALLBACK_LOCALE = 'en'

function getInitialLocale(): string {
  const userLang = navigator.language?.split('-')[0]?.toLowerCase()

  if (userLang && SUPPORTED_LOCALES.includes(userLang)) {
    return userLang
  }

  return FALLBACK_LOCALE
}

export function useI18n(...args: Parameters<typeof useVueI18n>) {
  const i18n = useVueI18n(...args)

  type KeyArg = Parameters<typeof i18n.t>[0]

  const tc = (key: KeyArg): string => {
    const translation = i18n.t(key)
    if (!translation) return ''
    return translation.charAt(0).toUpperCase() + translation.slice(1)
  }

  return {
    ...i18n,
    tc,
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { pl, en },
})
