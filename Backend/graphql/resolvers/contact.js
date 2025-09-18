import Contact from "../../models/Contact.js";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { contactSchema } from "../../validation/contact.schema.js";

const idSchema = z.string().length(24, "Invalid id format");

const getAll = async (_p) => {
  return await Contact.find();
};

const getById = async (_P, { id }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new GraphQLError("Contact not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }

  return contact;
};

export default { getAll, getById };
