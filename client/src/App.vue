<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="header">
      <nav>
        <RouterLink to="/board">Board</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.header {
  width: 100vw;
  height: 30px;
  display: flex;
  align-items: center;
  background-color: #e7e7e7;
  padding-left: 20px;
  grid-area: header;

}
</style>
