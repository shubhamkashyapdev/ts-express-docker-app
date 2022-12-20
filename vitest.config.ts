/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config'
import * as path from 'path'
export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude],
        reporters: 'verbose',
        globals: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
})
