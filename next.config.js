const withTM = require('next-transpile-modules')(['three', '@react-three/drei'])

module.exports = withTM({
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })

    return config
  },
})
