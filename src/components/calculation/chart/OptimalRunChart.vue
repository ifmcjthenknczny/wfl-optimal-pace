<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { formatTime, isMobile } from '../helpers'
import { type ChartDataPoint } from './types'

// TODO: deduplicate chart component
// TODO: optimal point in chart should attract cursor

const props = defineProps<{
  carPoints: ChartDataPoint[]
  runnerPoints: ChartDataPoint[]
  optimalDistanceIndex: number
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const pointsConfig = (dataset: ChartDataPoint[], optimalDistanceIndex: number) => {
  return dataset.map((point, index) => {
    const isOptimal = index === optimalDistanceIndex
    return {
      ...point,
      pointRadius: isOptimal ? 10 : 0,
      pointHoverRadius: isOptimal ? 14 : 5,
      pointHitRadius: isOptimal ? 20 : 5,
      pointBackgroundColor: isOptimal ? '#FF4500' : undefined,
      pointBorderColor: isOptimal ? '#fff' : undefined,
      pointBorderWidth: isOptimal ? 2 : 0,
    }
  })
}

const createChart = () => {
  if (!chartCanvas.value) {
    return
  }
  const applyMobileView = isMobile()

  const lineOptions = {
    pointRadius: 0,
    pointHitRadius: 10,
    borderWidth: applyMobileView ? 2 : 3,
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
          data: pointsConfig(props.runnerPoints, props.optimalDistanceIndex),
          borderColor: '#2f8f6b',
          backgroundColor: '#2f8f6b',
          ...lineOptions,
        },
        {
          label: 'Samochód',
          data: pointsConfig(props.carPoints, props.optimalDistanceIndex),
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
        axis: 'y',
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
            },
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
