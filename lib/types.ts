import { ReactNode } from "react";

export interface FormComponentProps {
  id: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  info?: string;
}

export interface FormFieldConfig {
  id: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "image"
    | "number";
  label: string;
  defaultValue?: any;
  validationRules?: {
    type?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | undefined;
  };
  options?: { label: string; value: string }[];
  info?: string;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  layout: {
    type: "vertical" | "horizontal";
    columns?: number;
  };
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
