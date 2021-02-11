<template>
  <div class="container">
    <h1>Safe Place</h1>
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  data() {
    return {
      title: 'Safe Place',
    }
  },
}
</script>
