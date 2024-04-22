import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config({ path: `./src/config/${process.env.NODE_ENV}.env` });
import express from "express";
import { connectToDatabase } from "./database/databaseConnection";
import { Agent } from "./database/models/agentModel";
import { getGraphQLServer } from "./graphql/graphqlConfig";
import { applyMiddleware } from "graphql-middleware";


const app = express();
connectToDatabase().then(() => {
  console.log(`Connected to MongoDb`);
});
app.use(express.json());
app.get(`${process.env.APP_ROUTE_PREFIX}/agents`, async (req, res) => {
  try {
    const newUser = Agent;
    let response = await newUser
      .find()
      .then((agents) => {
        res.json(response);
      })
      .catch((err: any) => {
        res.status(404).json({ message: "No agents found" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post(`${process.env.APP_ROUTE_PREFIX}/agents`, async (req, res) => {
  try {
    const newUser = new Agent(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

getGraphQLServer().then(async (result: any) => {
  result.applyMiddleware({
    app: app,
    path: `${process.env.APP_ROUTE_PREFIX}${process.env.GRAPHQL_ROUTE}`,
  });
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is up and runing with port : ${port}`);
});
