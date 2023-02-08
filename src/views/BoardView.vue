<script setup lang="ts">
import Board from '../components/Board.vue'

function keyDown() {
  console.log("ENTER")
}

</script>

<template>
  <div class="board-wrapper" @keydown.enter="keyDown">
    <Board />
  </div>
</template>

<style>
.board-wrapper {
  grid-area: body;
  overflow: hidden;
}
</style>
