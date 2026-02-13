import {defineConfig} from 'astro/config';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            theme: "one-dark-pro",
        },
    },

    integrations: [react(), tailwind({applyBaseStyles: false})],
    
    // 添加以下配置以支持 GitHub Pages 部署
    // 将 'Astro-Reunion' 替换为你的仓库名称
    base: '/Astro-Reunion/',
    
    // Vite 配置
    vite: {
        server: {
            allowedHosts: ['astro.local', 'localhost', '127.0.0.1', '0.0.0.0']
        }
    }
});