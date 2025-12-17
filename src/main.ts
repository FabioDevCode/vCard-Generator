import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import fr from './locales/fr.json'
import en from './locales/en.json'
import pt from './locales/pt.json'

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('vcard-locale')?.replace(/"/g, '') || 'fr',
    fallbackLocale: 'fr',
    messages: {
        fr,
        en,
        pt
    }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
