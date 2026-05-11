<script setup lang="ts">
import { ref } from 'vue'
import CalculationForm from './form/CalculationForm.vue'
import CalculationResult from './result/CalculationResult.vue'
import calculateOptimalRunParams from './form/optimize'

const calculationResult = ref<ReturnType<typeof calculateOptimalRunParams> | null>(null)

const handleResult = (result: ReturnType<typeof calculateOptimalRunParams> | null) => {
  calculationResult.value = result
}
</script>

<template>
  <section class="calculator-card">
    <CalculationForm @calculated="handleResult" />
    <CalculationResult v-if="calculationResult" :result="calculationResult" />
  </section>
</template>

<style scoped>
.calculator-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
}
</style>
