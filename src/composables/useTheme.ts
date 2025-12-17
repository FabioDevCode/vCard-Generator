import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { darkTheme, type GlobalTheme, type GlobalThemeOverrides } from 'naive-ui'

export type ThemeMode = 'dark' | 'light'

// Custom primary color
const primaryColor = '#638fe6'
const primaryColorHover = '#7aa0eb'
const primaryColorPressed = '#5078c9'
const primaryColorSuppl = '#7aa0eb'

export function useTheme() {
    const themeMode = useLocalStorage<ThemeMode>('vcard-theme', 'dark')

    const isDark = computed(() => themeMode.value === 'dark')

    const naiveTheme = computed<GlobalTheme | null>(() => {
        return themeMode.value === 'dark' ? darkTheme : null
    })

    const themeOverrides = computed<GlobalThemeOverrides>(() => ({
        common: {
            primaryColor,
            primaryColorHover,
            primaryColorPressed,
            primaryColorSuppl
        },
        Button: {
            colorPrimary: primaryColor,
            colorHoverPrimary: primaryColorHover,
            colorPressedPrimary: primaryColorPressed,
            colorFocusPrimary: primaryColorHover
        },
        Switch: {
            railColorActive: primaryColor
        }
    }))

    const toggleTheme = (): void => {
        themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark'
    }

    const setTheme = (mode: ThemeMode): void => {
        themeMode.value = mode
    }

    return {
        themeMode,
        isDark,
        naiveTheme,
        themeOverrides,
        toggleTheme,
        setTheme
    }
}
