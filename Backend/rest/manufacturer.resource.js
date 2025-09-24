import express from "express";
import Manufacturer from "../models/Manufacturer.js";
import Contact from "../models/Contact.js";
import { contactSchema } from "../validation/contact.schema.js";
import { z } from "zod";
import { manufacturerSchema } from "../validation/manufacturer.schema.js";

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

// GET ALL with pagination, search, and contact population
async function getAllManufacturers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const filter = {};
    if (search.trim() !== "") {
      filter.name = { $regex: search, $options: "i" };
    }

    const [items, totalCount] = await Promise.all([
      Manufacturer.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate("contact"),
      Manufacturer.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "All manufacturers (paginated): ",
      data: {
        items,
        totalCount,
        hasNextPage: skip + items.length < totalCount,
      },
    });
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

    const manufacturer = await Manufacturer.findById(req.params.id).populate(
      "contact"
    );

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

  const parsed = manufacturerSchema.partial().safeParse(req.body);
  // Failed to validate input
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.errors });
  }

  // Manufacturer with ID cannot be found
  let manufacturer = await Manufacturer.findById(req.params.id);
  
  if (!manufacturer) {
    return res.status(404).json({ message: "Could not find manufacturer." });
  }

  try {
    // Validate contact (if present)
    if (req.body.contact && manufacturer.contact) {
      const contactParsed = contactSchema.partial().safeParse(req.body.contact);
      if (!contactParsed.success) {
        return res.status(400).json({
          error: "Contact validation failed",
          details: contactParsed.error.errors,
        });
      }
      // Update contact
      await Contact.findByIdAndUpdate(
        manufacturer.contact,
        contactParsed.data,
        {
          runValidators: true,
          new: true,
        }
      );
    }

    // Validate manufacturer (excluding contact)
    const { contact, ...manufacturerData } = req.body;
    const manufacturerParsed = manufacturerSchema
      .omit({ contact: true })
      .partial()
      .safeParse(manufacturerData);

    if (!manufacturerParsed.success) {
      return res.status(400).json({
        error: "Manufacturer validation failed",
        details: manufacturerParsed.error.errors,
      });
    }

    // Update manufacturer
    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      manufacturerParsed.data,
      {
        runValidators: true,
        new: true,
      }
    ).populate("contact");

    res
      .status(200)
      .json({ message: "Manufacturer updated: ", data: updatedManufacturer });
  } catch (error) {
    console.error("Error updating manufacturer:", error);
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
    const manufacturer = await Manufacturer.findByIdAndDelete(
      req.params.id
    ).populate("contact");

    if (!manufacturer) {
      return res.status(404).json({ message: "Could not find manufacturer." });
    }

    const manufacturerContact = await Contact.findByIdAndDelete(
      manufacturer.contact
    );

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
