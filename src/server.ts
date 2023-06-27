import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { Server } from "http";

let server: Server;

// Database Connection
async function main() {
  try {
    // Connect to the database
    await mongoose.connect(config.database_url as string);
    console.log("🔥 Database connected 🔥");

    // Start the server
    server = app.listen(config.port, () => {
      console.log(`The app is running on port: ${config.port}`);
    });
  } catch (error) {
    console.log(`Failed to connect database`, error);
  }
}
main();
