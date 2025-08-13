module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-parameters',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-nullish-coalescing-operator'
  ]
}; 