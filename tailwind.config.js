module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.twig'],
  theme: {
    fontFamily: {
      body: ['sans-serif'],
      display: []
    },
    colors: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
