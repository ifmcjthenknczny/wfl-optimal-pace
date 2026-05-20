<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { formatTime, isMobile } from '../helpers'
import { MAX_DELAY_TIME_MINUTES } from './startDelayChartData'
import { type ChartDataPoint } from './types'

// TODO: deduplicate chart component

const props = defineProps<{
  points: ChartDataPoint[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) {
    return
  }
  const applyMobileView = isMobile()

  const lineOptions = {
    borderWidth: applyMobileView ? 2 : 3,
    pointRadius: 0,
    pointHitRadius: 10,
    tension: 0.1,
  }

  const gridOptions = {
    display: true,
    color: 'rgba(255, 255, 255, 0.1)',
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Dystans (km)',
          data: props.points,
          borderColor: '#2f8f6b',
          backgroundColor: '#2f8f6b',
          ...lineOptions,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          padding: 12,
          backgroundColor: 'rgba(28, 28, 28, 0.9)',
          callbacks: {
            title: (items) => {
              const time = items[0]?.parsed.x
              return `Opóźnienie startu: ${formatTime(time ?? 0, false)}`
            },
            label: (context) => {
              const distance = context.parsed.y
              return `Dystans: ${distance?.toFixed(3)} km`
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: MAX_DELAY_TIME_MINUTES,
          grid: gridOptions,
          title: {
            display: true,
            text: 'Czas [min]',
          },
          ticks: {
            callback: (value) => `${value} min`,
          },
        },
        y: {
          beginAtZero: true,
          min: 0,
          grid: gridOptions,
          title: {
            display: !applyMobileView,
            text: 'Dystans [km]',
          },
        },
      },
    },
  })
}

onMounted(createChart)

watch(
  [() => props.points],
  () => {
    if (chartInstance) {
      chartInstance.destroy()
      createChart()
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
  margin-top: 1.5rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

@media (min-width: 641px) {
  .chart-wrapper {
    padding: 1rem;
  }
}
</style>
