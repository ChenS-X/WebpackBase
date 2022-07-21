<template>
  <router-view></router-view>
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
* {
  padding: 0;
  margin: 0;
}
html,body{
  height: 100vh;
}
#app {
  height: 100vh;
}
</style>