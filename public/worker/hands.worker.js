
function loadHands() {
  self.importScripts('https://unpkg.com/@tensorflow-models/handpose@0.0.6/dist/handpose.js') // eslint-disable-line
  // eslint-disable-next-line
  // console.log(handpose)
}

onmessage = function (event) {
  switch (event.data.msg) {
    case 'load':
      loadHands()
      break
    default:
      break
  }
}
