<template>
  <div class="flex flex-row min-h-screen bg-base-200">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue";

@Options({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  isOpen: boolean = false;

  setIsOpen(value: boolean) {
    this.isOpen = value;
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.logo {
  max-width: 200px;
}
aside {
  text-align: center;
}
</style>
