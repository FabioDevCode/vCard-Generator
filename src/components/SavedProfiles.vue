<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NSelect,
  NButton,
  NSpace,
  NPopconfirm,
  NEmpty
} from 'naive-ui'
import { useVCard, type VCardData } from '@/composables/useVCard'
import { useAppI18n } from '@/composables/useI18n'

const emit = defineEmits<{
  (e: 'load', data: VCardData): void
  (e: 'generate', data: VCardData): void
}>()

const { t } = useAppI18n()
const { savedProfiles, deleteProfile, getProfile } = useVCard()

const selectedProfileId = ref<string | null>(null)

const profileOptions = computed(() => {
  return savedProfiles.value.map(profile => ({
    label: profile.name,
    value: profile.id
  }))
})

const hasProfiles = computed(() => savedProfiles.value.length > 0)

const handleSelectProfile = (id: string | null) => {
  selectedProfileId.value = id
  if (id) {
    const profile = getProfile(id)
    if (profile) {
      emit('load', profile.data)
    }
  }
}

const handleDeleteProfile = () => {
  if (selectedProfileId.value) {
    deleteProfile(selectedProfileId.value)
    selectedProfileId.value = null
  }
}

const handleGenerateProfile = () => {
  if (selectedProfileId.value) {
    const profile = getProfile(selectedProfileId.value)
    if (profile) {
      emit('generate', profile.data)
    }
  }
}

const resetSelection = () => {
  selectedProfileId.value = null
}

defineExpose({
  resetSelection
})
</script>

<template>
  <div class="saved-profiles">
    <div v-if="hasProfiles" class="profiles-content">
      <NSpace vertical :size="12">
        <NSelect
          v-model:value="selectedProfileId"
          :options="profileOptions"
          :placeholder="t('profiles.select')"
          size="medium"
          clearable
          @update:value="handleSelectProfile"
        />
        <div class="profile-actions" v-if="selectedProfileId">
          <NButton
            type="primary"
            size="medium"
            @click="handleGenerateProfile"
            class="action-button"
          >
            {{ t('form.generate') }}
          </NButton>

          <NPopconfirm
            :positive-text="t('profiles.delete')"
            negative-text="Cancel"
            @positive-click="handleDeleteProfile"
          >
            <template #trigger>
              <NButton type="error" size="medium" secondary class="action-button">
                {{ t('profiles.delete') }}
              </NButton>
            </template>
            {{ t('profiles.confirmDelete') }}
          </NPopconfirm>
        </div>
      </NSpace>
    </div>
    <NEmpty
      v-else
      :description="t('profiles.noProfiles')"
      size="small"
    />
  </div>
</template>

<style scoped>
.saved-profiles {
  width: 100%;
}

.profiles-content {
  width: 100%;
}

.profile-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-button {
  width: 100%;
}

@media (max-width: 600px) {
  .profile-actions {
    grid-template-columns: 1fr;
  }
}
</style>
