<template>
    <button
      class="btn"
      :class="[`btn--${color}`, `btn--${size}`]"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  withDefaults(
    defineProps<{
      color?: 'default' | 'danger' | 'success'
      size?: 'sm' | 'md' | 'lg'
    }>(),
    {
      color: 'default',
      size: 'md',
    },
  )
  </script>
  
  <style scoped>
  .btn {
    cursor: pointer;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.2s ease;
    line-height: 1;
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  .btn--sm {
    padding: 4px 12px;
    font-size: 0.85rem;
  }
  
  .btn--md {
    padding: 0.55rem 1rem;
    font-size: 0.95rem;
  }
  
  .btn--lg {
    padding: 0.75rem 1.4rem;
    font-size: 1.05rem;
  }
  
  /* --- colors --- */
  .btn--default {
    background: #eee;
    border: 1px solid #ccc;
    color: inherit;
  }
  
  .btn--default:hover:not(:disabled) {
    background: #ddd;
  }
  
  .btn--danger {
    background: transparent;
    border: 1px solid #dc3545;
    color: #dc3545;
  }
  
  .btn--danger:hover:not(:disabled) {
    background: #dc3545;
    color: #fff;
  }
  
  .btn--success {
    background: #2f8f6b;
    border: 1px solid transparent;
    color: #fff;
  }
  
  .btn--success:hover:not(:disabled),
  .btn--success:focus:not(:disabled) {
    background: #2a7d5f;
  }
  </style>