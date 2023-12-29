import { defineConfig, type CommonServerOptions } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

const commonOptions: CommonServerOptions = { open: true, host: true }

export default defineConfig({
  plugins: [tsconfigPaths(), VitePWA({ registerType: 'autoUpdate' })],
  build: { target: 'ESNext' },
  server: { ...commonOptions, port: 5_174 },
  preview: { ...commonOptions, port: 5_175 },
})
