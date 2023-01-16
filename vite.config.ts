/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import liveReload from 'vite-plugin-live-reload'
import Terminal from 'vite-plugin-terminal'

import * as path from 'path'

export default defineConfig({
    server: {
        // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
        host: '0.0.0.0',
        port: 5000,
        watch: {
            usePolling: true
        }
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/index.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild'
        }),
        liveReload('./src/**/*.ts'),
        Terminal()
    ],
    clearScreen: false,
    logLevel: 'info',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
})
