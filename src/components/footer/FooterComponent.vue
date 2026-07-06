<script setup lang="ts">
import FooterLink from './FooterLink.vue'
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <FooterLink
        href="https://www.wingsforlifeworldrun.com/pl"
        label="Wings for Life"
        position="left"
      />
      <p>©2026 Maciej Konieczny</p>
      <FooterLink
        href="https://github.com/ifmcjthenknczny/wfl-optimal-pace"
        label="Repository"
        position="right"
      />
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
</style>
