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
            primaryColorSuppl,
            heightMedium: '44px',
            heightLarge: '48px',
            fontSizeMedium: '16px',
            fontSizeLarge: '17px',
            borderRadius: '10px'
        },
        Button: {
            colorPrimary: primaryColor,
            colorHoverPrimary: primaryColorHover,
            colorPressedPrimary: primaryColorPressed,
            colorFocusPrimary: primaryColorHover,
            heightMedium: '44px',
            heightLarge: '48px',
            fontSizeMedium: '16px',
            fontSizeLarge: '17px',
            paddingMedium: '0 20px',
            paddingLarge: '0 24px'
        },
        Input: {
            heightMedium: '44px',
            heightLarge: '48px',
            fontSizeMedium: '16px',
            fontSizeLarge: '17px',
            paddingMedium: '0 14px',
            paddingLarge: '0 16px'
        },
        Select: {
            heightMedium: '44px',
            heightLarge: '48px'
        },
        Switch: {
            railColorActive: primaryColor,
            railHeight: '28px',
            railWidth: '52px',
            buttonHeight: '24px',
            buttonWidth: '24px'
        },
        Form: {
            labelFontSizeTopMedium: '15px',
            labelFontSizeTopLarge: '16px',
            feedbackFontSizeMedium: '14px'
        },
        Card: {
            titleFontSizeMedium: '18px',
            titleFontSizeLarge: '20px'
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
