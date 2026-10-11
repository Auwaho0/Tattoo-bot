import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
        port: 5173,
        host: true,
        proxy: {
            // Используется, только если VITE_API_URL не задан или пуст
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false, // не светим исходники в проде
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                // Разбиваем вендоров на отдельные чанки — улучшает кэш браузера
                manualChunks: function (id) {
                    if (!id.includes('node_modules'))
                        return;
                    // ВАЖНО: react-router проверяем ДО react,
                    // иначе он попадёт в react-vendor (содержит подстроку "react")
                    if (id.includes('react-router'))
                        return 'react-vendor';
                    if (id.includes('react-dom') || id.includes('/react/'))
                        return 'react-vendor';
                    if (id.includes('@tanstack/react-query'))
                        return 'query-vendor';
                    if (id.includes('zustand'))
                        return 'state-vendor';
                    return 'vendor';
                },
            },
        },
    },
});
