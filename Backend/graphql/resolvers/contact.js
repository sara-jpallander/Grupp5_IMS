import Contact from "../../models/Contact.js";
import { GraphQLError } from "graphql";

const getAll = async (_p) => {
          return await Contact.find();
        };

const getById = async (_P, { id }) => {
  const contact = await Contact.findById(id);

    if (!contact) {
        throw new GraphQLError("Contact not found", {
        extensions: { code: "404_NOT_FOUND" }
                })
            }

            return contact;
        };

export default { getAll, getById }