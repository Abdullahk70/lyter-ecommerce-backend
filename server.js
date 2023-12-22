import express  from "express";

import product from "./routes/product.js";
import orderRouter from "./routes/order.js";
import store from "./routes/store.js";
import bodyParser from "body-parser";
import cors from "cors";
import {handleErrors} from "./middleWare/error.js";
import {Logger} from "./middleWare/log.js";
import { DecodeJwt } from "./utils/decodeJwt.js";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import customerRouter from "./routes/customer.js";
import storeRouter from "./routes/store.js";

const app = express();

//parse application/json
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// Logger middleware
app.use(Logger.logRequest);
// app.get("/", function (req, res) {
//   res.send("welcome");
// });



//const EndpointHead = process.env.EndpointHead;
const EndpointHead = ""; // temporary...- JF
 mongoose.connect("mongodb+srv://lityer:123@cluster0.jla8m8u.mongodb.net/?retryWrites=true&w=majority").then(()=>{
  console.log("connected");
 }).then((e)=>{console.log(e)});
app.use(`${EndpointHead}/auth`, authRouter);
app.use(`${EndpointHead}/products`, productRouter);
app.use(`${EndpointHead}/customer`, customerRouter); 
app.use(`${EndpointHead}/stores`, storeRouter);  // probably store should have its own route
app.use(`${EndpointHead}/retailer`, customerRouter); // probably retailer should have its own route.

app.get(`${EndpointHead}/decodeJwt`, DecodeJwt); // probably retailer should have its own route.
   

// Middleware to log incoming requests to the orders route
app.use(`/orders`, (req, res, next) => {
  console.log(`Incoming request for orders route: ${req.method} ${req.originalUrl}`);
  console.log(`Request body:`, req.body);
  next();
}, orderRouter);

app.use(handleErrors);

app.listen(8000, function () {
  console.log("App is Listening http://localhost:8000");
});
