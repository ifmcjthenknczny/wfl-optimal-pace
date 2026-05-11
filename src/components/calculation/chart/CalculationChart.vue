<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { type ChartDataPoint } from './chartData'
import { formatTime } from '../helpers'

const props = defineProps<{
  carPoints: ChartDataPoint[]
  runnerPoints: ChartDataPoint[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Dystans Biegacza (km)',
          data: props.runnerPoints,
          borderColor: '#2f8f6b',
          backgroundColor: '#2f8f6b',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 10,
          tension: 0.1,
        },
        {
          label: 'Dystans Samochodu (km)',
          data: props.carPoints,
          borderColor: '#eb4034',
          backgroundColor: '#eb4034',
          borderWidth: 3,
          pointRadius: 0,
          pointHitRadius: 10,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
          padding: 12,
          backgroundColor: 'rgba(28, 28, 28, 0.9)',
          callbacks: {
            title: (items) => {
              const time = items[0]?.parsed.x
              return `Czas: ${formatTime(time ?? 0)}`
            },
            label: (context) => {
              const label = context.dataset.label
              const distance = context.parsed.y
              return ` ${label}: ${distance?.toFixed(3)} km`
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: Math.floor(props.carPoints.at(-1)!.x / 10) * 10,
          grid: {
            display: true,
            color: 'rgba(255, 255, 255, 0.1)',
          },
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
          grid: {
            display: true,
            color: 'rgba(255, 255, 255, 0.1)',
          },
          title: {
            display: true,
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
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}
</style>
