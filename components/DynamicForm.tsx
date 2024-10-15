"use client";

import React, { useState } from "react";
import { FormConfig, FormFieldConfig } from "@/lib/types";
import {
  TextInput,
  TextareaInput,
  SelectInput,
  CheckboxInput,
  RadioInput,
  DateInput,
  ImageUpload,
} from "./FormComponents";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (values: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ config, onSubmit }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateField = (
    field: FormFieldConfig,
    value: any
  ): string | undefined => {
    const { validationRules } = field;
    if (!validationRules) return;

    if (validationRules.required && (value === undefined || value === "")) {
      return "This field is required";
    }

    if (field.type === "number") {
      if (isNaN(value)) {
        // Add this line to check if the value is not a number
        return "Value must be a number"; // Error message for non-numeric value
      }
      if (validationRules.minLength && value < validationRules.minLength) {
        return `Minimum value is ${validationRules.minLength}`;
      }
      if (validationRules.maxLength && value > validationRules.maxLength) {
        return `Maximum value is ${validationRules.maxLength}`;
      }
    }

    // Existing string validation logic
    if (typeof value === "string") {
      if (
        validationRules.minLength &&
        value.length < validationRules.minLength
      ) {
        return `Minimum length is ${validationRules.minLength} characters`;
      }
      if (
        validationRules.maxLength &&
        value.length > validationRules.maxLength
      ) {
        return `Maximum length is ${validationRules.maxLength} characters`;
      }
      if (
        validationRules.pattern &&
        !new RegExp(validationRules.pattern).test(value)
      ) {
        return "Invalid format";
      }
    }

    if (validationRules.custom) {
      const customError = validationRules.custom(value);
      if (customError) {
        return customError;
      }
    }

    if (
      field.type === "date" &&
      validationRules.required &&
      !(value instanceof Date)
    ) {
      return "Please select a date";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    config.fields.forEach((field) => {
      const error = validateField(field, formValues[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSubmit(formValues);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      id: field.id,
      label: field.label,
      value: formValues[field.id] || field.defaultValue || "",
      onChange: (value: any) => handleChange(field.id, value),
      error: errors[field.id],
      info: field.info,
    };

    switch (field.type) {
      case "text":
        return <TextInput {...commonProps} />;
      case "textarea":
        return <TextareaInput {...commonProps} />;
      case "select":
        return <SelectInput {...commonProps} options={field.options || []} />;
      case "checkbox":
        return <CheckboxInput {...commonProps} />;
      case "radio":
        return <RadioInput {...commonProps} options={field.options || []} />;
      case "date":
        return <DateInput {...commonProps} />;
      case "image":
        return <ImageUpload {...commonProps} />;
      case "number": // Add this case for number input
        return (
          <TextInput
            {...commonProps}
            onChange={(value) => {
              const numericValue = value ? Number(value) : "";
              handleChange(field.id, numericValue);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        config.layout.type === "horizontal"
          ? "grid grid-cols-2 gap-4"
          : "flex flex-col space-y-4"
      )}
    >
      {config.fields.map((field) => (
        <div key={field.id} className="flex-1">
          {renderField(field)}
        </div>
      ))}
      <div
        className={cn(
          config.layout.type === "horizontal"
            ? "pt-4 col-span-2"
            : "w-full pt-4"
        )}
      >
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default DynamicForm;
