import Manufacturer from "../../models/Manufacturer.js"


const getAllManufacturers = async (_p) => {
    return await Manufacturer.find();
};

const getManufacturerById =  async (_P, { id }) => {
    const manufacturer = await Manufacturer.findById(id);

if(!manufacturer) {
    throw new GraphQLError("Manufacturer not found", {
        extensions: { code: "404_NOT_FOUND"}
    })
}

    return manufacturer;
};

const addManufacturer = async (_p, {...args}) => {
    const manufacturer = await Manufacturer.create(args);

    /* TODO: felhantering för att kolla att manufacturer inte redan finns,
        för att slippa dubletter 
    */

    return manufacturer
}

const updateManufacturer = async (_p, {id, ...args}) => {
    const manufacturer = await Manufacturer.findAndUpdate(args);
    
    if (!manufacturer) {
        throw new GraphQLError("Manufacturer not found", {
            extensions: { code: "404_NOT_FOUND"}
        })
    }

    return manufacturer;
};

const deleteManufacturer = async (_p, {id}) => {
    const manufacturer = await Manufacturer.findById(id)

    if (!manufacturer) {
        throw new GraphQLError("Manufacturer not found", {
            extensions: { code: "404_NOT_FOUND"}
        })
    }

    const manufacturerContact = await Contact.findbyIdAndDelete(manufacturer.contact);
    manufacturer = await Manufacturer.findbyIdAndDelete(id);

    return manufacturer;
};



export {
        getAllManufacturers,
        getManufacturerById,
        addManufacturer,
        updateManufacturer,
        deleteManufacturer
    }