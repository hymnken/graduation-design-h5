import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // 关键代码，需要跟 server 同 host 不然session可能保存不成功
    host: '127.0.0.1'
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.join(__dirname, 'src')
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'src/styles/index.scss';`
      }
    }
  },
  plugins: [vue()]
})
