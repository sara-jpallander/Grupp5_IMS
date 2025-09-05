import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();

const app = express();

app.use(express.json());

/* const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use(
	"/graphql",
	expressMiddleware(apollo, {
		context: async () => ({}),
	})
); */

async function connectDB() {
	if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
	await mongoose.connect(process.env.MONGODB_URI, {
		dbName: "IMS_DB", //om du inte sätter denna i din connection string
	});
	console.log("MongoDB connected");
}

connectDB()
	.then(() => {
		app.listen((process.env.PORT), () => {
			console.log(`GraphQL is running on port ${process.env.PORT}`);
		});
	})
	.catch(console.error);