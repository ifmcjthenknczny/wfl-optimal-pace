<template>
  <div class="distance-input">
    <label class="label">
      Dystans zawodów [km]
      <input :value="modelValue" @input="onInput" type="text" />
    </label>
    <div class="distance-presets">
      <button
        v-for="preset in PRESETS"
        :key="preset.value"
        type="button"
        class="preset-btn"
        :class="{ 'preset-btn--active': modelValue == preset.value }"
        @click="$emit('update:modelValue', preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const PRESETS = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: 'Półmaraton', value: 21.0975 },
  { label: 'Maraton', value: 42.195 },
] as const

const props = defineProps<{
  modelValue: number | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value as unknown as number)
}
</script>

<style scoped>
.distance-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
}

input {
  width: 100%;
  min-width: 0;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.distance-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.preset-btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-background-mute);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-btn:hover {
  border-color: #2f8f6b;
  border-color: #2f8f6b;
  color: #fff;
}

.preset-btn--active {
  background: #2f8f6b;
  border-color: #2f8f6b;
  color: #fff;
}
</style>
