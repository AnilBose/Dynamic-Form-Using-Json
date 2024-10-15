"use client";

import React from "react";
import DynamicForm from "@/components/DynamicForm";
import { FormConfig, FormFieldConfig, ValidationRules } from "@/lib/types";

const formConfig: FormConfig = {
  fields: [
    {
      id: "name",
      type: "text",
      label: "Name",
      validationRules: {
        type: "string",
        required: true,
        minLength: 2,
        custom: (value) => {
          if (value.includes("!")) {
            return "Name cannot contain special characters.";
          }
          return undefined;
        },
      },
      // defaultValue:"Anil",
      info: "Enter your full name",
    },
    {
      id: "email",
      type: "text",
      label: "Email",
      validationRules: {
        type: "string",
        required: true,
        minLength: 2,
        pattern: "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        custom: (value) => {
          if (value === "test@example.com") {
            return "This email is not allowed.";
          }
          return undefined;
        },
      },
      info: "We'll never share your email",
    },
    {
      id: "message",
      type: "textarea",
      label: "Message",
      validationRules: {
        type: "string",
        required: true,
        minLength: 2,
        maxLength: 500,
      },
    },
    {
      id: "category",
      type: "select",
      label: "Category",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      validationRules: { type: "string", minLength: 2, required: true },
    },
    {
      id: "subscribe",
      type: "checkbox",
      label: "Subscribe to newsletter",
      validationRules: { type: "boolean" },
    },
    {
      id: "preferredContact",
      type: "radio",
      label: "Preferred contact method",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Post", value: "post" },
      ],
      validationRules: { type: "string", minLength: 2, required: true },
    },
    {
      id: "birthdate",
      type: "date",
      label: "Birth Date",
      validationRules: { type: "string", minLength: 2, required: true },
    },
    {
      id: "avatar",
      type: "image",
      label: "Profile Picture",
      validationRules: { type: "object" },
    },
    {
      id: "age",
      type: "number",
      label: "Age",
      validationRules: {
        type: "integer",
        required: true,
        custom: (value) => {
          if (value < 1 || value > 120) {
            return "Age must be between 1 and 120.";
          }
          return undefined;
        },
      },
      info: "Enter your age",
    },
  ],
  layout: {
    type: "horizontal",
  },
};

const generateSchema = (formConfig: FormConfig) => {
  const schema: any = {
    type: "object",
    properties: {},
    required: [],
  };

  formConfig.fields.forEach((field) => {
    const { id, validationRules } = field;
    schema.properties[id] = { type: validationRules?.type || "string" };

    if (validationRules?.required) {
      schema.required.push(id);
    }

    if (validationRules?.minLength) {
      schema.properties[id].minLength = validationRules.minLength;
    }

    if (validationRules?.maxLength) {
      schema.properties[id].maxLength = validationRules.maxLength;
    }
  });

  return schema;
};

export default function Home() {
  const handleSubmit = async (values: Record<string, any>) => {
    console.log("values", JSON.stringify(values));
    const schema = generateSchema(formConfig);
    console.log(JSON.stringify(schema, null, 2));
    const payload = {
      values,
      schema,
    };
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation errors:", errorData.errors);
      } else {
        console.log("Form submitted successfully:", values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Form Example</h1>
      <DynamicForm config={formConfig} onSubmit={handleSubmit} />
    </div>
  );
}
