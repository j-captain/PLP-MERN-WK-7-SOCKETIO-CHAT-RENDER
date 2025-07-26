export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: '.dist', ]
  },
  server: {
    host: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/socket\.io/, '')
      },
      '/ws-test': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});