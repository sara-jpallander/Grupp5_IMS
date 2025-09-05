import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"
import Contact from "./models/Contact.js"
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

// REST API
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the REST API 🚀." });
});

app.post("/api/contacts", async (req, res) => {
	// const { name, email, phone } = req.body

	try {
		const contact = await Contact.create(req.body);

	  res.status(201).json({message:"Contact created: ", contact})
	} catch (error) {
		res.status(500).json({ error });
	}

});

//GET 

app.get("/api/contacts", async (req, res) => {
	try{
		const contacts = await Contact.find();
		res.status(200).json({message:"All Contacts", contacts});
	} catch (error) {
		res.status(500).json({ error});
	}
});

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