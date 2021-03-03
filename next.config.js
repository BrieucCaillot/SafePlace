// https://github.com/pmndrs/drei/issues/2
const withTM = require('next-transpile-modules')([
  'three',
  '@react-three/drei',
  'react-spring',
])

module.exports = withTM({
  productionBrowserSourceMaps: true,
  webpack: (config, options) => {
    config.module.rules.push(
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      },
      // https://github.com/pmndrs/react-spring/issues/1078
      {
        test: /react-spring/,
        sideEffects: true,
      }
    )

    return config
  },
})
