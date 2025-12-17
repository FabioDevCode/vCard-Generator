<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useAppI18n, SUPPORTED_LOCALES, type SupportedLocale } from '@/composables/useI18n'
import { computed } from 'vue'

const { currentLocale, setLocale } = useAppI18n()

const options = computed(() => {
  return SUPPORTED_LOCALES.map(locale => ({
    label: `${locale.flag} ${locale.label}`,
    value: locale.value
  }))
})

const handleChange = (value: SupportedLocale) => {
  setLocale(value)
}
</script>

<template>
  <NSelect
    :value="currentLocale"
    :options="options"
    size="medium"
    style="width: 160px"
    @update:value="handleChange"
  />
</template>
