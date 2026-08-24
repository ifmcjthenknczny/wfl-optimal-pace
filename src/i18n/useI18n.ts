import { useI18n as useVueI18n } from 'vue-i18n'

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
