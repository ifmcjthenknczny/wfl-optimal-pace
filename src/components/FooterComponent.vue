<template>
  <footer class="footer">
    <div class="footer-container">
      <p>©2026 Maciej Konieczny</p>
      <a class="repo-link" href="https://github.com/ifmcjthenknczny/wfl-optimal-pace">Repository</a>
    </div>
  </footer>
</template>

<style scoped>
p {
  margin: 0;
  display: block;
}

.footer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 0em;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  color: white;
  text-align: center;
  font-weight: 200;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.repo-link {
  font-size: 0.5rem;
}

a {
  color: white;
}
</style>
