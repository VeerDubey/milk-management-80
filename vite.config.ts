import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Web-only Vite configuration (no Electron dependencies)
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
          ],
          'utils-vendor': ['date-fns', 'clsx', 'sonner'],
        }
      }
    },
    commonjsOptions: {
      esmExternals: true,
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true,
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.WEB_ONLY_MODE': JSON.stringify('true'),
      }
    },
    // Only exclude Node.js built-ins for web compatibility
    exclude: ['fs', 'path', 'os', 'crypto']
  }
}));