import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config({ path: `./src/config/${process.env.NODE_ENV}.env` });
import express from "express";
import { connectToDatabase } from "./database/databaseConnection";
import { Agent } from "./database/models/agentModel";
import { getGraphQLServer } from "./graphql/graphqlConfig";
import { applyMiddleware } from "graphql-middleware";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Employee } from "./database/models/employeeModel";


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

app.post(`${process.env.APP_ROUTE_PREFIX}/login`, async (req, res) => {
  try {
    const { agentId, password } = req.body;
    const user = await Agent.findOne({ agentId });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordDetails = await Employee.findOne({ _id: user.agentDetails });
    if(passwordDetails && passwordDetails?.password){
        const passwordMatch = await bcrypt.compare(passwordDetails.password,password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Authentication failed" });
        }
       
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRECT_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ token });
    }
    return res.status(400).json({error:"No password found for this agent"})
  
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
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
