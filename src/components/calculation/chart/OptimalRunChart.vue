<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { formatTime, isMobile } from '../helpers'
import { type ChartDataPoint } from './types'
import ContentWrapper from '@/components/slide/ContentWrapper.vue'
import { useI18n } from '@/i18n/useI18n'

// TODO: deduplicate chart component
// TODO: optimal point in chart should attract cursor

const props = defineProps<{
  carPoints: ChartDataPoint[]
  runnerPoints: ChartDataPoint[]
}>()

const { tc, locale } = useI18n()

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
          label: tc('common.runner'),
          data: props.runnerPoints,
          borderColor: '#2f8f6b',
          backgroundColor: '#2f8f6b',
          ...lineOptions,
        },
        {
          label: tc('common.car'),
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
              return `${tc('common.distance')}: ${distance?.toFixed(3)} km`
            },
            label: (context) => {
              const time = context.parsed.x
              return `${tc('common.time')}: ${formatTime(time ?? 0)}`
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
            text: `${tc('common.time')} [min]`,
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
            text: `${tc('common.distance')} [km]`,
          },
        },
      },
    },
  })
}

onMounted(createChart)

watch(
  [() => props.carPoints, () => props.runnerPoints, () => locale],
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
  <ContentWrapper :header="`${tc('chart.optimalRun.header')}:`">
    <canvas ref="chartCanvas"></canvas>
  </ContentWrapper>
</template>
