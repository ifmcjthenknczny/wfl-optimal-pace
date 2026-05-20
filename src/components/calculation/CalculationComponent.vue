<script setup lang="ts">
import { ref } from 'vue'
import CalculationForm from './form/CalculationForm.vue'
import CalculationResult from './result/CalculationResult.vue'
import calculateOptimalRunParams from './form/optimize'
import type { gatherOptimalRunChartData } from './chart/optimalRunChartData'
import OptimalRunChart from './chart/OptimalRunChart.vue'
import CalculationSlider from './CalculationSlider.vue'
import SlideWrapper from '../slide/SlideWrapper.vue'
import type { gatherStartDelayChartData } from './chart/startDelayChartData'
import StartDelayChart from './chart/StartDelayChart.vue'

const calculationResult = ref<ReturnType<typeof calculateOptimalRunParams> | null>(null)
const optimalRunChartData = ref<ReturnType<typeof gatherOptimalRunChartData> | null>(null)
const startDelayChartData = ref<ReturnType<typeof gatherStartDelayChartData> | null>(null)

const handleResult = (result: ReturnType<typeof calculateOptimalRunParams> | null) => {
  calculationResult.value = result
}

const handleOptimalRunChartData = (data: ReturnType<typeof gatherOptimalRunChartData> | null) => {
  optimalRunChartData.value = data
}

const handleStartDelayChartData = (data: ReturnType<typeof gatherStartDelayChartData> | null) => {
  startDelayChartData.value = data
}
</script>

<template>
  <section class="calculator-card">
    <CalculationForm
      @calculated="handleResult"
      @gathered="handleOptimalRunChartData"
      @gathered-start-delay="handleStartDelayChartData"
    />
    <CalculationSlider v-if="calculationResult || optimalRunChartData">
      <SlideWrapper>
        <CalculationResult v-if="calculationResult" :result="calculationResult" />
      </SlideWrapper>
      <SlideWrapper>
        <OptimalRunChart
          v-if="optimalRunChartData"
          :car-points="optimalRunChartData.carPoints"
          :runner-points="optimalRunChartData.runnerPoints"
          :optimal-distance-index="optimalRunChartData.optimalDistanceIndex"
        />
      </SlideWrapper>
      <SlideWrapper>
        <StartDelayChart v-if="startDelayChartData" :points="startDelayChartData.points" />
      </SlideWrapper>
    </CalculationSlider>
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
