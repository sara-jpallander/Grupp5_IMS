import { GraphQLError } from "graphql";
import Manufacturer from "../../models/Manufacturer.js";
import Contact from "../../models/Contact.js";
import { z } from "zod";
import { contactSchema } from "../../validation/contact.schema.js";
import { manufacturerSchema } from "../../validation/manufacturer.schema.js";

const idSchema = z.string().length(24, "Invalid id format");

const getAll = async (_p) => {
  return await Manufacturer.find().populate("contact");
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
  // Validate nested contact
  const contactParsed = contactSchema.safeParse(input.contact);
  if (!contactParsed.success) {
    throw new GraphQLError(
      "Contact validation failed: " + JSON.stringify(contactParsed.error.errors)
    );
  }
  // Validate manufacturer
  const manufacturerParsed = manufacturerSchema.safeParse(input);
  if (!manufacturerParsed.success) {
    throw new GraphQLError(
      "Manufacturer validation failed: " +
        JSON.stringify(manufacturerParsed.error.errors)
    );
  }
  const contact = await Contact.create(contactParsed.data);
  let manufacturer = await Manufacturer.create({
    ...input,
    contact: contact._id,
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
  if (input.contact && manufacturer.contact) {
    const contactParsed = contactSchema.partial().safeParse(input.contact);
    if (!contactParsed.success) {
      throw new GraphQLError(
        "Contact validation failed: " +
          JSON.stringify(contactParsed.error.errors)
      );
    }
    await Contact.findByIdAndUpdate(manufacturer.contact, contactParsed.data, {
      runValidators: true,
      new: true,
    });
  }
  const manufacturerParsed = manufacturerSchema.partial().safeParse(input);
  if (!manufacturerParsed.success) {
    throw new GraphQLError(
      "Manufacturer validation failed: " +
        JSON.stringify(manufacturerParsed.error.errors)
    );
  }
  const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
    id,
    { ...input, contact: manufacturer.contact },
    {
      runValidators: true,
      new: true,
    }
  ).populate("contact");
  return updatedManufacturer;
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

  // console.log(`Deleted ${manufacturer} and contact details: ${manufacturerContact} successfully.`);

  return manufacturer;
};

export default {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};

