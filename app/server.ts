import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";

const app = createApp();

if (import.meta.env.DEV) {
  showRoutes(app);
}

export default app;
