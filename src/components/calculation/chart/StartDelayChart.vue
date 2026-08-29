<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { formatTime, isMobile } from '../helpers'
import { MAX_DELAY_TIME_MINUTES } from './startDelayChartData'
import { type ChartDataPoint } from './types'
import ContentWrapper from '@/components/slide/ContentWrapper.vue'
import { useI18n } from '@/i18n/i18n'

// TODO: deduplicate chart component

const props = defineProps<{
  points: ChartDataPoint[]
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
          label: `${tc('common.distance')} (km)`,
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
              return `${tc('common.delay')}: ${formatTime(time ?? 0, false)}`
            },
            label: (context) => {
              const distance = context.parsed.y
              return `${tc('common.distance')}: ${distance?.toFixed(3)} km`
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
  [() => props.points, () => locale],
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
  <ContentWrapper :header="`${tc('chart.startDelay.header')}:`">
    <canvas ref="chartCanvas"></canvas>
  </ContentWrapper>
</template>
