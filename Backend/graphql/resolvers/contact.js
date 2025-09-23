import Contact from "../../models/Contact.js";
import { GQLError, zodToBadInput } from "../../utils/errors.js";

const getAll = async (_p) => {
  try {
    return await Contact.find();
  } catch (error) {
    throw GQLError.internal("Failed to retrieve all contacts");
  }
};

const getById = async (_P, { id }) => {
  try {
    // Validate ID
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) throw zodToBadInput("Invalid id", parsedId.error);

    // Get contact
    const contact = await Contact.findById(id);
    if (!contact) throw GQLError.notFound("Contact not found");

    return contact;
  } catch (error) {
    throw GQLError.internal("Failed to retrieve contact");
  }
};

export default { getAll, getById };
