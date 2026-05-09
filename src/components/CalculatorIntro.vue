<template>
  <div class="intro">
    <img alt="Wings for Life logo" class="logo" src="../assets/logo.png" />
    <h1>Kalkulator Wings for Life</h1>
    <p>
      Podaj swój wynik z ostatnich zawodów aby oszacować realny cel tempa na bieg. Model wylicza
      Twoje optymalne możliwości na podstawie wzorów Riegla i porównuje ze schematem poruszania się
      samochodu pościgowego.
    </p>
  </div>
</template>

<style scoped>
.intro {
  text-align: center;
}

.logo {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto 0.9rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--color-heading);
}

p {
  max-width: 720px;
  margin: 0 auto;
  color: var(--color-text);
  opacity: 0.9;
}
</style>
