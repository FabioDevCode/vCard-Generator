<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NModal,
  useMessage
} from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useVCard, type VCardData } from '@/composables/useVCard'
import { useAppI18n } from '@/composables/useI18n'

const props = defineProps<{
  modelValue: VCardData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VCardData): void
  (e: 'generate'): void
  (e: 'reset'): void
}>()

const { t } = useAppI18n()
const { validateVCard, saveProfile, createEmptyVCard } = useVCard()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const showSaveModal = ref(false)
const profileName = ref('')

const formData = reactive<VCardData>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(formData, newVal)
  },
  { deep: true }
)

watch(
  formData,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)

const rules: FormRules = {
  firstName: {
    required: true,
    message: () => t('form.validation.required'),
    trigger: 'blur'
  },
  lastName: {
    required: true,
    message: () => t('form.validation.required'),
    trigger: 'blur'
  },
  email: {
    type: 'email',
    message: () => t('form.validation.invalidEmail'),
    trigger: 'blur'
  },
  phone: {
    pattern: /^[\d\s\+\-\(\)]*$/,
    message: () => t('form.validation.invalidPhone'),
    trigger: 'blur'
  },
  website: {
    type: 'url',
    message: () => t('form.validation.invalidUrl'),
    trigger: 'blur'
  }
}

const handleGenerate = async () => {
  const result = validateVCard(formData)
  if (result.success) {
    emit('generate')
  } else {
    formRef.value?.validate()
  }
}

const openSaveModal = () => {
  profileName.value = `${formData.firstName} ${formData.lastName}`.trim() || ''
  showSaveModal.value = true
}

const handleSaveProfile = () => {
  if (!profileName.value.trim()) return
  
  saveProfile(profileName.value.trim(), formData)
  message.success(t('profiles.saved'))
  showSaveModal.value = false
  profileName.value = ''
}

const handleReset = () => {
  const emptyData = createEmptyVCard()
  Object.assign(formData, emptyData)
  emit('reset')
}
</script>

<template>
  <div class="vcard-form">
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
    >
      <NFormItem :label="t('form.firstName')" path="firstName">
        <NInput
          v-model:value="formData.firstName"
          :placeholder="t('form.firstName')"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('form.lastName')" path="lastName">
        <NInput
          v-model:value="formData.lastName"
          :placeholder="t('form.lastName')"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('form.phone')" path="phone">
        <NInput
          v-model:value="formData.phone"
          placeholder="+33 6 12 34 56 78"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('form.email')" path="email">
        <NInput
          v-model:value="formData.email"
          placeholder="email@example.com"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('form.company')" path="company">
        <NInput
          v-model:value="formData.company"
          :placeholder="t('form.company')"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('form.jobTitle')" path="jobTitle">
        <NInput
          v-model:value="formData.jobTitle"
          :placeholder="t('form.jobTitle')"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('form.website')" path="website">
        <NInput
          v-model:value="formData.website"
          placeholder="https://example.com"
          clearable
        />
      </NFormItem>

      <NSpace vertical :size="12" class="form-actions">
        <NButton
          type="primary"
          size="large"
          block
          @click="handleGenerate"
        >
          {{ t('form.generateQr') }}
        </NButton>
        <NButton
          size="large"
          block
          secondary
          @click="openSaveModal"
        >
          {{ t('form.saveProfile') }}
        </NButton>
        <NButton
          size="large"
          block
          tertiary
          @click="handleReset"
        >
          {{ t('form.reset') }}
        </NButton>
      </NSpace>
    </NForm>

    <NModal
      v-model:show="showSaveModal"
      preset="dialog"
      :title="t('form.saveProfile')"
      positive-text="OK"
      negative-text="Cancel"
      @positive-click="handleSaveProfile"
    >
      <NFormItem :label="t('form.profileName')">
        <NInput
          v-model:value="profileName"
          :placeholder="t('form.profileNamePlaceholder')"
        />
      </NFormItem>
    </NModal>
  </div>
</template>

<style scoped>
.vcard-form {
  width: 100%;
}

.form-actions {
  margin-top: 24px;
}
</style>
