import { NextResponse } from "next/server";
import Ajv from "ajv";
import { connectToDB } from "@/lib/mongo";
import DynamicTable from "@/lib/dynamicTable";
import { Schema } from "mongoose";

const ajv = new Ajv();

export async function POST(req: Request) {
  await connectToDB();
  const { values, schema } = await req.json();
  console.log("schema", schema);
  const validate = ajv.compile(schema);
  const valid = validate(values);

  if (!valid) {
    return NextResponse.json({ errors: validate.errors }, { status: 400 });
  }

  const newSchemaDefinition: any = {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  };

  for (const key in schema.properties) {
    const property = schema.properties[key];
    newSchemaDefinition[key] = {
      type:
        property.type === "string"
          ? String
          : property.type === "integer"
          ? Number
          : property.type === "boolean"
          ? Boolean
          : property.type === "object"
          ? Schema.Types.Mixed
          : undefined,
      ...(property.minLength && { minlength: property.minLength }),
      ...(property.maxLength && { maxlength: property.maxLength }),
      ...(property.required && { required: property.required }),
    };
  }

  DynamicTable.schema = new Schema(newSchemaDefinition, { timestamps: true });

  try {
    const newEntry = new DynamicTable(values);
    await newEntry.save();
    return NextResponse.json(
      { message: "Data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
