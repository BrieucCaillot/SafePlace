<template>
  <h1>{{ title }}</h1>
</template>

<script lang="ts">
import three from './three'

export default {
  name: 'App',
  data() {
    // Init Three Scene
    three()

    return {
      title: 'Safe Place',
    }
  },
}
</script>
