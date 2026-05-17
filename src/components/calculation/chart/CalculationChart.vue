<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { type ChartDataPoint } from './chartData'
import { formatTime } from '../helpers'
import { MOBILE_BREAKPOINT_PX } from '../const'

const props = defineProps<{
  carPoints: ChartDataPoint[]
  runnerPoints: ChartDataPoint[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) {
    return
  }
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT_PX

  const lineOptions = {
    borderWidth: isMobile ? 2 : 3,
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
          label: 'Biegacz',
          data: props.runnerPoints,
          borderColor: '#2f8f6b',
          backgroundColor: '#2f8f6b',
          ...lineOptions,
        },
        {
          label: 'Samochód',
          data: props.carPoints,
          borderColor: '#eb4034',
          backgroundColor: '#eb4034',
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
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          onClick: () => {},
        },
        tooltip: {
          enabled: true,
          padding: 12,
          backgroundColor: 'rgba(28, 28, 28, 0.9)',
          callbacks: {
            title: (items) => {
              const distance = items[0]?.parsed.y
              return `Dystans: ${distance?.toFixed(3)} km`
            },
            label: (context) => {
              const time = context.parsed.x
              return `Czas: ${formatTime(time ?? 0)}`
            }
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: Math.floor(props.carPoints.at(-1)!.x / 10) * 10,
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
            display: !isMobile,
            text: 'Dystans [km]',
          },
        },
      },
    },
  })
}

onMounted(createChart)

watch(
  [() => props.carPoints, () => props.runnerPoints],
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
