<template>
  <h1>{{ title }}</h1>
</template>

<script lang="ts">
import three from './three'
import Handtrack from './utils/Handtrack'

export default {
  name: 'App',
  data() {
    // Init Three Scene
    three()
    const handtrack = new Handtrack(document.querySelector('video') as HTMLVideoElement)
    handtrack.Load().then(() => {
      handtrack.StartCamera()
      handtrack.Subscribe(console.log)
    })

    return {
      title: 'Safe Place',
    }
  },
}
</script>
