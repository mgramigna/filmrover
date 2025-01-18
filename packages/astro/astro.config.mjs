// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import aws from "astro-sst";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: aws(),
  image: {
    service: passthroughImageService(),
  },
  prefetch: true,
});
