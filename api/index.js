import { app } from "../server/src/app.bootstrap.js";

// Vercel serverless entry point.
// app.bootstrap.js builds the Express app and ONLY calls app.listen() inside
// its default bootstrap() (used by `npm run dev` locally). Importing it here
// gives us the fully-configured request handler with no server of its own,
// which is exactly what Vercel's Node runtime expects.
export default app;
