import Contact from "../../models/Contact.js";


const getAllContacts = async (_p) => {
          return await Contact.find();
        };

const getAllContactsById =  async (_P, { id }) => {
            const contact = await Contact.findById(id);

    if (!contact) {
        throw new GraphQLError("Contact not found", {
        extensions: { code: "404_NOT_FOUND" }
                })
            }

            return contact;
        };

export {getAllContacts, getAllContactsById}