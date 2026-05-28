<template>
  <footer class="footer">
    <div class="footer-container">
      <p>©2026 Maciej Konieczny</p>
      <div class="repo">
        <a class="repo-link" href="https://github.com/ifmcjthenknczny/wfl-optimal-pace"
          >Repository</a
        >
      </div>
    </div>
  </footer>
</template>

<style scoped>
p {
  margin: 0;
  display: block;
}

.footer-container {
  position: relative;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.repo {
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 8px;
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
