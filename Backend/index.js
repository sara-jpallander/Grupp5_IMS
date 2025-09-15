import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"
import Contact from "./models/Contact.js"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import contactsResource from "./rest/contacts.resource.js";
import productsResource from "./rest/products.resource.js";
import manufacturerResource from "./rest/manufacturer.resource.js";

import typeDefs from "./graphql/typeDefs.js"
import resolvers from "./graphql/resolvers.js"
// import reso from "./graphql/resolvers/products.js"

dotenv.config();
const app = express();
app.use(express.json());

/* GraphQL API */

const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use(
	"/graphql",
	expressMiddleware(apollo, {
		context: async () => ({}),
	})
);

/* REST API */

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the REST API 🚀." });
});

app.use("/api/contacts", contactsResource);
app.use("/api/products", productsResource);
app.use("/api/manufacturers", manufacturerResource);

async function connectDB() {
	if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
	await mongoose.connect(process.env.MONGODB_URI, {
		dbName: "IMS_DB", //om du inte sätter denna i din connection string
	});
	console.log("MongoDB connected");
}

connectDB()
	.then(() => {
		const PORT = process.env.PORT || 3002;
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	}).catch(console.error);