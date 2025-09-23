import { GraphQLError } from "graphql";
import Manufacturer from "../../models/Manufacturer.js";
import Contact from "../../models/Contact.js";
import { z } from "zod";
import { contactSchema } from "../../validation/contact.schema.js";
import { manufacturerSchema } from "../../validation/manufacturer.schema.js";
import { GQLError, zodToBadInput } from "../../utils/errors.js";


const idSchema = z.string().length(24, "Invalid id format");

const getAll = async (_p, { page = 1, limit = 10, search }) => {
  try {
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by search term
    if (search && search.trim() !== "") {
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

    return {
      items,
      totalCount,
      hasNextPage: skip + items.length < totalCount,
    };
  } catch (error) {
    throw error instanceof GraphQLError
      ? error
      : new GraphQLError("Failed to retrieve all manufacturers", {
          extensions: { code: "500_INTERNAL_SERVER_ERROR" },
        });
  }
};

const getById = async (_P, { id }) => {
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
      throw zodToBadInput("Invalid id", parsedId.error);

  }
  try {
    const manufacturer = await Manufacturer.findById(id).populate("contact");

  if (!manufacturer) {
    throw GQLError.notFound("Manufacturer not found");
  }

    return manufacturer;
  } catch (error) {
    throw error instanceof GraphQLError
      ? error
      : new GraphQLError("Failed to retrieve manufacturer by ID", {
          extensions: { code: "500_INTERNAL_SERVER_ERROR" },
        });
  }
};

const add = async (_p, { input }) => {
  try {
    const parsed = manufacturerSchema.safeParse(input);

  if (!parsed.success) {
       throw zodToBadInput("Manufacturer validation failed", parsed.error);
  }

   const exists = await Manufacturer.findOne({ name: parsed.data.name });
    if (exists) {
    throw GQLError.conflict("Manufacturer with this name already exists");
  }

  try {
    const contactDoc = await Contact.create(parsed.data.contact);
    const { contact, ...manufacturerData } = parsed.data;

    let manufacturer = await Manufacturer.create({
      ...manufacturerData,
      contact: contactDoc._id,
    });

    manufacturer = await Manufacturer.findById(manufacturer._id).populate("contact");
    return manufacturer;
  } catch (error) {
    if (error?.code === 11000) {
      throw GQLError.conflict("Duplicate key, manufacturer already exists");
    }
    throw GQLError.internal("Failed to add manufacturer");
  }
};


const updateById = async (_p, { id, input }) => {
  // Validate ID parameter
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
        throw zodToBadInput("Invalid id", parsedId.error);

  }

  const manufacturer = await Manufacturer.findById(id);

  // Manufacturer with ID cannot be found
  if (!manufacturer) {
      throw GQLError.notFound("Manufacturer not found");

  }

  try {
    // Validate contact (if present)
    if (input.contact && manufacturer.contact) {
      const contactParsed = contactSchema.partial().safeParse(input.contact);

      if (!contactParsed.success) {
          throw zodToBadInput("Contact validation failed", contactParsed.error);

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
           throw zodToBadInput("Manufacturer validation failed", manufacturerParsed.error);

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
    if (error?.name === "GraphQLError") throw error;
    if (error?.code === 11000) throw GQLError.conflict("Duplicate key");
    throw GQLError.internal("Failed to update manufacturer");
  }
};

const deleteById = async (_p, { id }) => {
  try {
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

    // Delete contact
    const manufacturerContact = await Contact.findByIdAndDelete(
      manufacturer.contact
    );

    return manufacturer;
  } catch (error) {
    throw error instanceof GraphQLError
      ? error
      : new GraphQLError("Failed to delete manufacturer", {
          extensions: { code: "500_INTERNAL_SERVER_ERROR" },
        });
  }
};

export default {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
