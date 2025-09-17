import express from "express";
import Manufacturer from "../models/Manufacturer.js";
import Contact from "../models/Contact.js";
import { contactSchema } from "../schemas/contactSchema.js";
import { z } from "zod";
import { manufacturerSchema } from "../schemas/manufacturerSchema.js";

const idSchema = z.string().length(24, "Invalid id format");

const router = express.Router();

// ROUTES
router.get("/", getAllManufacturers);
router.post("/", createManufacturer);
router.get("/:id", getManufacturer);
router.put("/:id", updateManufacturer);
router.delete("/:id", deleteManufacturer);

// CREATE
async function createManufacturer(req, res) {
  // Validate the nested contact object
  const contactParsed = contactSchema.safeParse(req.body.contact);
  if (!contactParsed.success) {
    return res.status(400).json({
      error: "Contact validation failed",
      details: contactParsed.error.errors,
    });
  }
  // Validate the manufacturer object (including the nested contact)
  const manufacturerParsed = manufacturerSchema.safeParse(req.body);
  if (!manufacturerParsed.success) {
    return res.status(400).json({
      error: "Manufacturer validation failed",
      details: manufacturerParsed.error.errors,
    });
  }
  try {
    /* skapa contact - spara id - koppla till manuf. i samband med att den skapas */
    // Create the contact first
    const contact = await Contact.create(contactParsed.data);
    // Create the manufacturer with the new contact's id
    const manufacturer = await Manufacturer.create({
      ...req.body,
      contact: contact._id,
    });

    /*
        {
            "name": "IKEA",
            "country": "Sweden",
            "website": "ikea.se",
            "description": "Hej!",
            "address": "Sverigevägen 123",
            "contact": {
                "name": "Ingvar",
                "email": "ingvar@ikea.se",
                "phone": "+1234567890"
            },
        }
        */

    res
      .status(201)
      .json({ message: "Manufacturer created: ", data: manufacturer });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to create manufacturer.",
      error,
    });
  }
}

// GET ALL
async function getAllManufacturers(req, res) {
  try {
    const manufacturers = await Manufacturer.find();

    if (!manufacturers) {
      return res.status(404).json({ message: "Manufacturers not found." });
    }

    res
      .status(200)
      .json({ message: "All manufacturers: ", data: manufacturers });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to get all manufacturers.",
      error,
    });
  }
}

// GET BY ID
async function getManufacturer(req, res) {
  try {
    // Validate ID parameter
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res
        .status(400)
        .json({ error: "Invalid ID format", details: parsedId.error.errors });
    }
    const manufacturer = await Manufacturer.findById(req.params.id);

    if (!manufacturer) {
      return res.status(404).json({ message: "Could not find manufacturer." });
    }

    res
      .status(200)
      .json({ message: "Fetched manufacturer: ", data: manufacturer });
    console.log("Get manufacturer by ID");
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to get manufacturer by ID.",
      error,
    });
  }
}

// UPDATE BY ID
async function updateManufacturer(req, res) {
  // Validate ID parameter
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res
      .status(400)
      .json({ error: "Invalid ID format", details: parsedId.error.errors });
  }
  // Validate request body using Zod schema
  const parsed = manufacturerSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    // If validation fails, return 400 with error details.
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.errors });
  }
  try {
    const manufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!manufacturer) {
      return res.status(404).json({ message: "Could not find manufacturer." });
    }

    res
      .status(200)
      .json({ message: "Manufacturer updated: ", data: manufacturer });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to update manufacturer by ID.",
      error,
    });
  }
}

// DELETE BY ID
async function deleteManufacturer(req, res) {
  // Validate ID parameter
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res
      .status(400)
      .json({ error: "Invalid ID format", details: parsedId.error.errors });
  }
  try {
    const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);

    if (!manufacturer) {
      return res.status(404).json({ message: "Could not find manufacturer." });
    }

    res
      .status(200)
      .json({ message: "Manufacturer deleted: ", data: manufacturer });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to delete manufacturer by ID.",
      error,
    });
  }
}

export default router;
