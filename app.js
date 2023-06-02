require('dotenv').config();
require('express-async-errors');

const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument =  YAML.load("./swagger.yaml");

const express = require('express');
const app = express();

// extra security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


//connect DB
const connectDB = require("./db/connect");
// router
let authRouter = require("./routes/auth");
let jobRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// Authenticated User
const authenticatedUser = require("./middleware/authentication");
app.use(express.json());
// extra packages




app.set('trust proxy', 1);

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
}));

app.use(helmet());
app.use(cors());
app.use(xss());


app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/jobs",authenticatedUser,jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>

      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
