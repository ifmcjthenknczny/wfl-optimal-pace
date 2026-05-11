<script setup lang="ts">
import { ref } from 'vue'
import CalculationForm from './form/CalculationForm.vue'
import CalculationResult from './result/CalculationResult.vue'
import calculateOptimalRunParams from './form/optimize'
import type { gatherChartData } from './chart/chartData'
import CalculationChart from './chart/CalculationChart.vue'

const calculationResult = ref<ReturnType<typeof calculateOptimalRunParams> | null>(null)
const chartData = ref<ReturnType<typeof gatherChartData> | null>(null)

const handleResult = (result: ReturnType<typeof calculateOptimalRunParams> | null) => {
  calculationResult.value = result
}

const handleChartData = (data: ReturnType<typeof gatherChartData> | null) => {
  chartData.value = data
}
</script>

<template>
  <section class="calculator-card">
    <CalculationForm @calculated="handleResult" @gathered="handleChartData" />
    <CalculationResult v-if="calculationResult" :result="calculationResult" />
    <CalculationChart
      v-if="chartData"
      :car-points="chartData.carPoints"
      :runner-points="chartData.runnerPoints"
    />
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
