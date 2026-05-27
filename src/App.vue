<script setup lang="ts">
import CalculatorIntro from './components/calculation/intro/CalculationIntro.vue'
import FooterComponent from './components/footer/FooterComponent.vue'
import CalculationComponent from './components/calculation/CalculationComponent.vue'

// TODO: i18n
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
  margin-bottom: 1.5rem;
}

@media (min-width: 641px) {
  main {
    margin-top: 0;
    margin-bottom: 4rem;
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
