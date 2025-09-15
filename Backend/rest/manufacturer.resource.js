import express from "express";
import Manufacturer from "../models/Manufacturer.js";
import Contact from "../models/Contact.js"

const router = express.Router();

// ROUTES
router.get("/", getAllManufacturers);
router.post("/", createManufacturer);
router.get("/:id", getManufacturer);
router.put("/:id", updateManufacturer);
router.delete("/:id", deleteManufacturer);

// CREATE
async function createManufacturer(req, res) {
	try {

        /* skapa contact - spara id - koppla till manuf. i samband med att den skapas */
        const contact = await Contact.create(req.body.contact);
		const manufacturer = await Manufacturer.create({...req.body, contact: contact._id});

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

    res.status(201).json({ message: "Manufacturer created: ", data: manufacturer });
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to create manufacturer.", error });
	}
}

// GET ALL
async function getAllManufacturers(req, res) {
  try {
  const manufacturers = await Manufacturer.find();

  if (!manufacturers) {
      return res.status(404).json({ message: "Manufacturers not found." });
  }

  res.status(200).json({ message: "All manufacturers: ", data: manufacturers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error. Failed to get all manufacturers.", error });
  }
}


// GET BY ID
async function getManufacturer(req, res) {
	try {
		
        const manufacturer = await Manufacturer.findById(req.params.id)

        if (!manufacturer) {
            return res.status(404).json({ message: "Could not find manufacturer." });
        }

        res.status(200).json({ message: "Fetched manufacturer: ", data: manufacturer })
    console.log("Get manufacturer by ID");
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to get manufacturer by ID.", error });
	}
}

// UPDATE BY ID
async function updateManufacturer(req, res) {
	try {
		const manufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!manufacturer) {
            return res.status(404).json({ message: "Could not find manufacturer." });
        }

        res.status(200).json({ message: "Manufacturer updated: ", data: manufacturer})
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to update manufacturer by ID.", error });
	}
}

// DELETE BY ID
async function deleteManufacturer(req, res) {
	try {
		const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);

        if (!manufacturer) {
            return res.status(404).json({ message: "Could not find manufacturer." });
        }

        res.status(200).json({ message: "Manufacturer deleted: ", data: manufacturer});
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to delete manufacturer by ID.", error });
	}
}

export default router;