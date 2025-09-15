import mongoose from "mongoose";

/* abonnemang 

    abb / abbo
*/

const ManufacturerSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true}, /* Ska denna kopplas till name som finns i Contact också? */
    country: {type: String},
    website: {type: String},
    description: {type: String},
    address: {type: String},
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
        required: true
    }
},
    { collection: "manufacturers" }
);

/* name
country
website
description
address
contact */

export default mongoose.model("Manufacturer", ManufacturerSchema);