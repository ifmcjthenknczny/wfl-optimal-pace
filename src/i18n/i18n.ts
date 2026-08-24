import { createI18n } from 'vue-i18n'
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

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { pl, en },
})
