import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), "");

    const target = env.VITE_API_URL || "http://localhost:5101";

    return {
        plugins: [react()],
        build: {
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ["react", "react-dom", "react-router-dom"],
                        mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
                        motion: ["framer-motion"],
                        redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"]
                    }
                }
            },
            chunkSizeWarningLimit: 900
        },
        server: {
            port: 5176,
            strictPort: true,
            proxy: {
                "/api": {
                    target,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, "")
                }
            }
        }
    };
});