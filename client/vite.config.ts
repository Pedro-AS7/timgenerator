import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				contact: resolve(__dirname, "contact.html"),
			},
		},
	},
	server: {
		port: 5173,
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
});
