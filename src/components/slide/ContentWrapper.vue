<script lang="ts" setup>
const props = defineProps<{
  header?: string
}>()
</script>

<template>
  <div class="content-wrapper">
    <div class="content-header" v-if="!!props.header">
      <h3>{{ props.header }}</h3>
    </div>
    <slot />
  </div>
</template>

<style lang="css" scoped>
.content-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
  margin-top: 1rem;
  padding-bottom: 3rem;
  background: color-mix(in srgb, var(--color-background-mute) 78%, transparent);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
}

.content-header h3 {
  font-weight: 700;
}

@media (min-width: 641px) {
  .content-wrapper {
    margin-top: 0;
    padding: 1rem;
  }

  .content-header {
    margin-top: 0;
  }
}
</style>
