<template>
  <div class="intro">
    <img alt="Wings for Life logo" class="logo" src="@/assets/logo.png" />
    <h1>Kalkulator Optymalnego Biegu</h1>
    <p>Podaj swój wynik z ostatnich zawodów aby oszacować realny cel tempa na bieg.</p>
    <p>
      Model wylicza Twoje możliwości na podstawie wzorów Riegla, porównuje je ze schematem
      poruszania się samochodu pościgowego i optymalizuje pod kątem najdłuższego przebytego
      dystansu.
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
  margin: 8px 0;
  color: var(--color-text);
  opacity: 0.9;
}
</style>
