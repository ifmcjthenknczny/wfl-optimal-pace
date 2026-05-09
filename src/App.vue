<script setup lang="ts">
import CalculatorIntro from './components/CalculatorIntro.vue'
import FooterComponent from './components/FooterComponent.vue'
import CalculationComponent from './components/calculation/CalculationComponent.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <CalculatorIntro />
    </div>
  </header>

  <main>
    <CalculationComponent />
  </main>
  <FooterComponent />
</template>

<style scoped>
header {
  line-height: 1.5;
}

main {
  margin-top: 2rem;
}

@media (min-width: 1024px) {
  main {
    margin-top: 0;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
