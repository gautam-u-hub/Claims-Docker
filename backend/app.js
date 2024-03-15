const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load('./api.yaml');
const { startMetricsServer, restResponseTimeHistogram } = require("./utils/metrics");
const responseTime = require("response-time");




app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['https://lively-panda-d4bb46.netlify.app','http://localhost:3000'], 
    credentials: true
}));

app.use(
    responseTime((req, res, time) => {
        if (req?.route?.path) {

            restResponseTimeHistogram.observe(
                {
                    method: req.method,          
                    route: req.route.path,      
                    status_code: res.statusCode 
                },
                time * 1000  
            );
        }
    })
);




app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

const userRoutes = require("./routes/userRoutes");
const policyRoutes = require("./routes/policyRoutes");
const claimRoutes = require("./routes/claimRoutes");


app.use("", userRoutes);
app.use("", policyRoutes);
app.use("", claimRoutes);

app.use(errorMiddleware);


module.exports = app;
