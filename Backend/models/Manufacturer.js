import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String },
    website: { type: String },
    description: { type: String },
    address: { type: String },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
  },
  { collection: "manufacturers" }
);

export default mongoose.model("Manufacturer", ManufacturerSchema);
