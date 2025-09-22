import { GraphQLError } from "graphql";
import Manufacturer from "../../models/Manufacturer.js";
import Contact from "../../models/Contact.js";
import { z } from "zod";
import { contactSchema } from "../../validation/contact.schema.js";
import { manufacturerSchema } from "../../validation/manufacturer.schema.js";

const idSchema = z.string().length(24, "Invalid id format");

const getAll = async (_p, { page = 1, limit = 10, search }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by search term
  if (search && search.trim() !== "") {
    filter.name = { $regex: search, $options: "i" };
  }

  const [items, totalCount] = await Promise.all([
    Manufacturer.find(filter).sort({ name: 1 }).skip(skip).limit(limit).populate("contact"),
    Manufacturer.countDocuments(filter)
  ]);

  return {
    items,
    totalCount,
    hasNextPage: skip + items.length < totalCount
  }
};

const getById = async (_P, { id }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  const manufacturer = await Manufacturer.findById(id).populate("contact");

  if (!manufacturer) {
    throw new GraphQLError("Manufacturer not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }

  return manufacturer;
};

const add = async (_p, { input }) => {
  const parsed = manufacturerSchema.safeParse(input);

  if (!parsed.success) {
    console.log("Manufacturer validation failed:", parsed.error);
    throw new GraphQLError(
      "Manufacturer validation failed: " + JSON.stringify(parsed.error)
    );
  }

  const contactDoc = await Contact.create(parsed.data.contact);
  const { contact, ...manufacturerData } = parsed.data;

  let manufacturer = await Manufacturer.create({
    ...manufacturerData,
    contact: contactDoc._id,
  });

  manufacturer = await Manufacturer.findById(manufacturer._id).populate(
    "contact"
  );

  /* TODO: felhantering för att kolla att manufacturer inte redan finns,
        för att slippa dubletter 
    */

  return manufacturer;
};

const updateById = async (_p, { id, input }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  const manufacturer = await Manufacturer.findById(id);
  if (!manufacturer) {
    throw new GraphQLError("Manufacturer not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }

  try {
    // Validate contact (if present)
    if (input.contact && manufacturer.contact) {
      const contactParsed = contactSchema.partial().safeParse(input.contact);
      if (!contactParsed.success) {
        throw new GraphQLError(
          "Contact validation failed: " +
            JSON.stringify(contactParsed.error)
        );
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
    const { contact, ...manufacturerData } = input;
    const manufacturerParsed = manufacturerSchema
      .omit({ contact: true })
      .partial()
      .safeParse(manufacturerData);

    if (!manufacturerParsed.success) {
      throw new GraphQLError(
        "Manufacturer validation failed: " +
          JSON.stringify(manufacturerParsed.error)
      );
    }

    // Update manufacturer
    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
      id,
      manufacturerParsed.data,
      {
        runValidators: true,
        new: true,
      }
    ).populate("contact");
    
    return updatedManufacturer;
  } catch (error) {
    console.error("Error updating manufacturer:", error);
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(`Failed to update manufacturer: ${error.message}`);
  }
};

const deleteById = async (_p, { id }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  let manufacturer = await Manufacturer.findByIdAndDelete(id).populate(
    "contact"
  );

  if (!manufacturer) {
    throw new GraphQLError("Manufacturer not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }

  const manufacturerContact = await Contact.findByIdAndDelete(
    manufacturer.contact
  );

  return manufacturer;
};

export default {
  getAll,
  getById,
  add,
  updateById,
  deleteById
};
