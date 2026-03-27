<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Toaster position="bottom-center" :duration="3000" />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<style>
:root {
  --color-primary: #f97316;
  --color-danger: #dc2626;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 16px;
  background: #f9fafb;
  color: #111827;
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
}

input {
  font-family: inherit;
}
</style>
