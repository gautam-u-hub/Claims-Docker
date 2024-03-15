const app = require('./app'); // Ensure this path is correct
const dotenv = require('dotenv');
const connectDatabase = require("./config/database");
const { startMetricsServer,restResponseTimeHistogram } = require("./utils/metrics");


process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

dotenv.config({ path: "./config/config.env" });

connectDatabase();

startMetricsServer();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

module.exports = server;

process.on("unhandledRejection", err => {
    console.error(`Error: ${err.message}`);
    console.error(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});


