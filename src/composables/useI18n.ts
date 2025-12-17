import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useI18n as useVueI18n } from 'vue-i18n'

export type SupportedLocale = 'fr' | 'en' | 'pt'

export const SUPPORTED_LOCALES: { value: SupportedLocale; label: string; flag: string }[] = [
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'pt', label: 'Português', flag: '🇵🇹' }
]

export function useAppI18n() {
    const storedLocale = useLocalStorage<SupportedLocale>('vcard-locale', 'fr')
    const { locale, t } = useVueI18n()

    const currentLocale = computed({
        get: () => locale.value as SupportedLocale,
        set: (value: SupportedLocale) => {
            locale.value = value
            storedLocale.value = value
        }
    })

    const setLocale = (newLocale: SupportedLocale): void => {
        currentLocale.value = newLocale
    }

    const initLocale = (): void => {
        locale.value = storedLocale.value
    }

    return {
        currentLocale,
        setLocale,
        initLocale,
        t,
        SUPPORTED_LOCALES
    }
}
