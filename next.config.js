const withTM = require('next-transpile-modules')([
  'three',
  '@react-three/drei',
  'react-spring',
])

module.exports = withTM({
  productionBrowserSourceMaps: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })

    return config
  },
})
