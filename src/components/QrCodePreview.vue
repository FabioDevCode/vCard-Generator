<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NButton, NEmpty, NSpin, NSpace } from 'naive-ui'
import { useAppI18n } from '@/composables/useI18n'

const props = defineProps<{
  qrDataUrl: string
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (e: 'download'): void
}>()

const { t } = useAppI18n()

const hasQrCode = computed(() => !!props.qrDataUrl)
</script>

<template>
  <NCard class="qr-preview" :title="t('qrCode.title')">
    <div class="qr-container">
      <NSpin :show="isGenerating">
        <div v-if="hasQrCode" class="qr-content">
          <img
            :src="qrDataUrl"
            alt="QR Code vCard"
            class="qr-image"
          />
          <NSpace justify="center" class="qr-actions">
            <NButton
              type="primary"
              @click="emit('download')"
            >
              {{ t('qrCode.download') }}
            </NButton>
          </NSpace>
        </div>
        <NEmpty
          v-else
          :description="t('qrCode.empty')"
          class="qr-empty"
        />
      </NSpin>
    </div>
  </NCard>
</template>

<style scoped>
.qr-preview {
  height: 100%;
  border-radius: 16px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.qr-actions {
  margin-top: 8px;
}

.qr-empty {
  padding: 40px 20px;
}
</style>
