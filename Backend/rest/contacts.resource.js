import express from "express";
import Contact from "../models/Contact.js";
import { contactSchema } from "../schemas/contactSchema.js";

const idSchema = z.string().length(24, "Invalid id format");
const router = express.Router();

// ROUTES
router.get("/", getAllContacts);
router.post("/", createContact);
router.get("/:id", getContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

// CREATE
async function createContact(req, res) {
  try {
    // Validate request body using Zod schema
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      // If validation fails, return 400 with error details.
      return res
        .status(400)
        .json({ error: "Validation failed", details: parsed.error.errors });
    }
    // If validation passes, create the contact.
    const contact = await Contact.create(parsed.data);
    res.status(201).json({ message: "Contact created: ", data: contact });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to create contact.",
      error,
    });
  }
}

//GET ALL
async function getAllContacts(req, res) {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ message: "All Contacts: ", data: contacts });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to get all contacts.",
      error,
    });
  }
}

// GET BY ID
async function getContact(req, res) {
  try {
    // Validate ID parameter
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res
        .status(400)
        .json({ error: "Invalid ID format", details: parsedId.error.errors });
    }
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact by ID: ", data: contact });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to get contact by ID.",
      error,
    });
  }
}

// UPDATE BY ID
async function updateContact(req, res) {
  try {
    // Validate request body using Zod schema
    const parsed = contactSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      // If validation fails, return 400 with error details.
      return res
        .status(400)
        .json({ error: "Validation failed", details: parsed.error.errors });
    }
    const updateContactById = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateContactById) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res
      .status(200)
      .json({ message: "Updated contact by ID:", data: updateContactById });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to update contact by ID.",
      error,
    });
  }
}

// DELETE BY ID
async function deleteContact(req, res) {
  try {
    // Validate ID parameter
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res
        .status(400)
        .json({ error: "Invalid ID format", details: parsedId.error.errors });
    }
    const deleteContactById = await Contact.findByIdAndDelete(req.params.id);

    if (!deleteContactById) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res
      .status(200)
      .json({ message: "Deleted contact by ID", data: deleteContactById });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to delete contact by ID.",
      error,
    });
  }
}

export default router;
