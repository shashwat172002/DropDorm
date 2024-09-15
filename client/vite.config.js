import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'https://drop-dorm.vercel.app/',       //https://dormdrop.onrender.com   //http://localhost:3000
    //     secure: false,
    //   },
    // },
  },
  plugins: [react()],
});

// https://dorm-drop-backend.vercel.app/
