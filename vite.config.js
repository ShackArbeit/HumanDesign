import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:"/HumanDesign/",
  plugins: [react()],
  css:{
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]_[local]_[hash:5]',
      globalModulePaths: ["./componentB.module.css"], 
    }
  }
})
