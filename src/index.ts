import express from "express";
import { router } from "./routes";
import { errorHandler } from "./middleware";

const app = express();
const port = process.env.PORT || 3000;

// Use the image routes
app.use("/", router);

// Error handling middleware (should be after all routes)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Image Optimization API is running at http://localhost:${port}`);
});
