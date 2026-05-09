<template>
  <div class="intro">
    <img alt="Wings for Life logo" class="logo" src="../assets/logo.png" />
    <h1>Kalkulator Wings for Life</h1>
    <p>
      Podaj swój wynik referencyjny i profil biegacza, aby szybko oszacować realny cel na bieg.
      Model porównuje Twój czas z tempem samochodu pościgowego i podaje optymalny dystans oraz tempo.
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
