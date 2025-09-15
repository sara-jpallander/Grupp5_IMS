import { GraphQLError } from "graphql";
import Manufacturer from "../../models/Manufacturer.js"
import Contact from "../../models/Contact.js";

const getAllManufacturers = async (_p) => {
    return await Manufacturer.find();
};

const getManufacturerById = async (_P, { id }) => {
    const manufacturer = await Manufacturer.findById(id).populate("contact");

if(!manufacturer) {
    throw new GraphQLError("Manufacturer not found", {
        extensions: { code: "404_NOT_FOUND"}
    })
}

    return manufacturer;
};

const addManufacturer = async (_p, { input }) => {
    const contact = await Contact.create(input.contact);
    let manufacturer = await Manufacturer.create({ ...input, contact: contact._id });
    manufacturer = await Manufacturer.findById(manufacturer._id).populate("contact");

    /* TODO: felhantering för att kolla att manufacturer inte redan finns,
        för att slippa dubletter 
    */

    return manufacturer;
}

const updateManufacturer = async (_p, { id, input }) => {
    const manufacturer = await Manufacturer.findById(id);
    
    if (!manufacturer) {
        throw new GraphQLError("Manufacturer not found", {
            extensions: { code: "404_NOT_FOUND"}
        })
    }

    if (input.contact && manufacturer.contact) {
        await Contact.findByIdAndUpdate(manufacturer.contact, input.contact, {
            runValidators: true,
            new: true
        });
    }

    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(id, { ...input, contact: manufacturer.contact }, {
        runValidators: true,
        new: true
    }).populate("contact");

    return updatedManufacturer;
};

const deleteManufacturer = async (_p, {id}) => {
    let manufacturer = await Manufacturer.findByIdAndDelete(id).populate("contact");

    if (!manufacturer) {
        throw new GraphQLError("Manufacturer not found", {
            extensions: { code: "404_NOT_FOUND"}
        })
    }

    const manufacturerContact = await Contact.findByIdAndDelete(manufacturer.contact);

    // console.log(`Deleted ${manufacturer} and contact details: ${manufacturerContact} successfully.`);

    return manufacturer;
};

export {
        getAllManufacturers,
        getManufacturerById,
        addManufacturer,
        updateManufacturer,
        deleteManufacturer
    }