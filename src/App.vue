<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NSpace,
  NCard,
  NH1,
  NText,
  NMessageProvider
} from 'naive-ui'
import VCardForm from '@/components/VCardForm.vue'
import QrCodePreview from '@/components/QrCodePreview.vue'
import SavedProfiles from '@/components/SavedProfiles.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { useVCard, type VCardData } from '@/composables/useVCard'
import { useQrCode } from '@/composables/useQrCode'
import { useTheme } from '@/composables/useTheme'
import { useAppI18n } from '@/composables/useI18n'

const { createEmptyVCard, generateVCardString } = useVCard()
const { qrDataUrl, isGenerating, generateQrCode, downloadAsJpeg, clearQrCode } = useQrCode()
const { naiveTheme, themeOverrides, isDark } = useTheme()
const { t, initLocale } = useAppI18n()

const vCardData = ref<VCardData>(createEmptyVCard())

onMounted(() => {
  initLocale()
})

const handleGenerate = async () => {
  const vCardString = generateVCardString(vCardData.value)
  await generateQrCode(vCardString)
}

const handleLoadProfile = (data: VCardData) => {
  vCardData.value = { ...data }
}

const handleGenerateFromProfile = async (data: VCardData) => {
  vCardData.value = { ...data }
  await handleGenerate()
}


const handleDownload = () => {
  const name = `${vCardData.value.firstName}-${vCardData.value.lastName}`.toLowerCase().replace(/\s+/g, '-') || 'vcard'
  downloadAsJpeg(name)
}
const savedProfilesRef = ref<InstanceType<typeof SavedProfiles> | null>(null)

const handleReset = () => {
  vCardData.value = createEmptyVCard()
  savedProfilesRef.value?.resetSelection()
  clearQrCode()
}
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NLayout class="app-layout" :class="{ 'dark-mode': isDark }">
        <NLayoutHeader class="app-header" bordered>
          <div class="header-content">
            <div class="header-title">
              <NH1 class="app-title">{{ t('app.title') }}</NH1>
              <NText class="app-subtitle" depth="3">{{ t('app.subtitle') }}</NText>
            </div>
            <NSpace align="center" :size="16" class="header-controls">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </NSpace>
          </div>
        </NLayoutHeader>

        <NLayoutContent class="app-content">
          <div class="main-grid">
            <!-- QR Code Preview (top on mobile) -->
            <div class="qr-section">
              <QrCodePreview
                :qr-data-url="qrDataUrl"
                :is-generating="isGenerating"
                @download="handleDownload"
              />
            </div>

            <!-- Form Section -->
            <div class="form-section">
              <NCard :title="t('profiles.title')" class="profiles-card">
                <SavedProfiles
                  ref="savedProfilesRef"
                  @load="handleLoadProfile"
                  @generate="handleGenerateFromProfile"
                  @reset="handleReset"
                />
              </NCard>

              <NCard class="form-card">
                <VCardForm
                  v-model="vCardData"
                  @generate="handleGenerate"
                  @reset="handleReset"
                />
              </NCard>
            </div>
          </div>
        </NLayoutContent>

        <NLayoutFooter class="app-footer">
          <div class="footer-content">
            <NText depth="3">
              Created by <a href="https://github.com/FabioDevCode" target="_blank" class="footer-link">Fabio R. LOPES</a>
            </NText>
          </div>
        </NLayoutFooter>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  overscroll-behavior: none;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.app-layout:not(.dark-mode) {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.app-header {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.dark-mode .app-header {
  background: rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-title {
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(90deg, #638fe6, #3873d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  font-size: 0.875rem;
}

.header-controls {
  flex-shrink: 0;
}

.app-content {
  padding: 0px;
  margin: 0 auto;
  width: 100%;
  overflow: visible;
}

.main-grid {
  display: grid;
  max-width: 1400px;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  align-items: start;
  overflow: visible;
  margin: 24px auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 16px;
  order: 1;
}

.qr-section {
  order: 2;
  position: sticky;
  top: 0px;
}

.profiles-card,
.form-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark-mode .profiles-card,
.dark-mode .form-card {
  background: rgba(30, 30, 46, 0.95);
}

/* Mobile layout */
@media (max-width: 1432px) {
  .main-grid {
    margin: 16px;
    margin-bottom: 48px;
  }
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
    margin: 16px;
    margin-bottom: 48px;
  }

  .qr-section {
    order: 1;
    position: static;
  }

  .form-section {
    order: 2;
  }

  .app-header {
    padding: 12px 16px;
  }

  .app-title {
    font-size: 1.25rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
}


.app-footer {
  padding: 24px;
  background: #FFFFFF;
  text-align: center;
}

.dark-mode .app-footer {
  background: #101015;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 0.7;
  text-decoration: underline;
}
</style>
