<template>
  <div class="main">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  setup() {
    const state = reactive({
        title: 'nihao1111'
    })

    return {
        ...toRefs(state)
    }
  }
};
</script>

<style>
</style>