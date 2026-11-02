import { defineField, defineType } from "sanity";
import { CITIES } from "../../lib/options";
import { vehicle } from "./vehicle";

const make = defineType({
  name: "make",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "logo", type: "image" }),
  ],
});

const seller = defineType({
  name: "seller",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "phone", type: "string", description: "International format, e.g. +971 4 123 4567" }),
    defineField({
      name: "whatsapp",
      type: "string",
      description: "Digits only with country code, e.g. 971501234567",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "digits" }),
    }),
    defineField({ name: "city", type: "string", options: { list: [...CITIES] } }),
  ],
});

const page = defineType({
  name: "page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
  ],
});

export const schemaTypes = [vehicle, make, seller, page];
