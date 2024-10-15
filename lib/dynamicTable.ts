import mongoose, { Schema, Document } from "mongoose";

interface DynamicTableDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // This allows for dynamic keys
}

const baseSchema = new Schema<DynamicTableDocument>({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Check if the model already exists
const DynamicTable = mongoose.models.DynamicTable || mongoose.model<DynamicTableDocument>("DynamicTable", baseSchema);

export default DynamicTable;
