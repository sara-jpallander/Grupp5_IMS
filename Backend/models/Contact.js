import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: { type: String, required: true, trim: true},
    phone: { type: String, trim: true},
},
    { collection: "contacts" }
);

// name
// email
// phone

export default mongoose.model("Contact", ContactSchema);