import express from "express";
import Contact from "../models/Contact.js";

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
		const contact = await Contact.create(req.body);

	  res.status(201).json({ message: "Contact created: ", data: contact })
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to create contact.", error });
	}
};

//GET ALL
async function getAllContacts(req, res) {
	try {
		const contacts = await Contact.find();
		res.status(200).json({ message:"All Contacts: ", data: contacts });
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to get all contacts.", error });
	}
};

// GET BY ID
async function getContact(req, res) {
	try {
		const contact = await Contact.findById(req.params.id);

		if(!contact) {
			return res.status(404).json({error: "Contact not found" });
		}
		res.status(200).json({message: "Contact by ID: ", data: contact})
		
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to get contact by ID.", error });
	}
};

// UPDATE BY ID
async function updateContact(req, res) {
	try {
    const updateContactById = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
});

    if(!updateContactById) {
      return res.status(404).json({error: "Contact not found"});
    }
    res.status(200).json({message: "Updated contact by ID:", data: updateContactById })
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to update contact by ID.", error });
	}
};

// DELETE BY ID
async function deleteContact(req, res) {
	try {
        const deleteContactById = await Contact.findByIdAndDelete(req.params.id);

        if(!deleteContactById) {
            return res.status(404).json({error: "Contact not found"});
        }
        res.status(200).json({message: "Deleted contact by ID", data: deleteContactById })
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to delete contact by ID.", error });
	}
}

export default router;