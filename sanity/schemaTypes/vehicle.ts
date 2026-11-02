import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BODY_TYPES,
  CITIES,
  CYLINDERS,
  DRIVETRAINS,
  FEATURE_CATEGORIES,
  FUEL_TYPES,
  REGIONAL_SPECS,
  STATUSES,
  TRANSMISSIONS,
} from "../../lib/options";

const list = <T extends string | number>(values: readonly T[]) => ({
  list: values.map((value) => ({ title: String(value), value })),
});

export const vehicle = defineType({
  name: "vehicle",
  title: "Vehicle",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "specs", title: "Specs" },
    { name: "media", title: "Media & content" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "overview", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "overview",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      type: "string",
      group: "overview",
      options: { ...list(STATUSES), layout: "radio", direction: "horizontal" },
      initialValue: "available",
      validation: (r) => r.required(),
    }),
    defineField({ name: "featured", type: "boolean", group: "overview", initialValue: false }),
    defineField({
      name: "make",
      type: "reference",
      to: [{ type: "make" }],
      group: "overview",
      validation: (r) => r.required(),
    }),
    defineField({ name: "model", type: "string", group: "overview", validation: (r) => r.required() }),
    defineField({ name: "trim", type: "string", group: "overview" }),
    defineField({
      name: "year",
      type: "number",
      group: "overview",
      validation: (r) =>
        r
          .required()
          .integer()
          .min(1990)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "price",
      title: "Price (AED)",
      type: "number",
      group: "overview",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "monthlyPrice",
      title: "Monthly price (AED)",
      description: "Shown as “Financing from AED X / month”. Leave empty to hide.",
      type: "number",
      group: "overview",
      validation: (r) => r.positive(),
    }),
    defineField({ name: "city", type: "string", group: "overview", options: list(CITIES) }),
    defineField({
      name: "seller",
      type: "reference",
      to: [{ type: "seller" }],
      group: "overview",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "overview",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({ name: "bodyType", type: "string", group: "specs", options: list(BODY_TYPES) }),
    defineField({ name: "fuelType", type: "string", group: "specs", options: list(FUEL_TYPES) }),
    defineField({ name: "transmission", type: "string", group: "specs", options: list(TRANSMISSIONS) }),
    defineField({ name: "drivetrain", type: "string", group: "specs", options: list(DRIVETRAINS) }),
    defineField({
      name: "cylinders",
      type: "number",
      group: "specs",
      description: "Leave empty for electric vehicles.",
      options: list(CYLINDERS),
    }),
    defineField({
      name: "engineSize",
      title: "Engine",
      type: "string",
      group: "specs",
      description: "e.g. 3.0L twin-turbo flat-six",
    }),
    defineField({
      name: "mileage",
      title: "Mileage (km)",
      type: "number",
      group: "specs",
      validation: (r) => r.min(0),
    }),
    defineField({ name: "regionalSpec", type: "string", group: "specs", options: list(REGIONAL_SPECS) }),
    defineField({ name: "exteriorColor", type: "string", group: "specs" }),
    defineField({ name: "interiorColor", type: "string", group: "specs" }),
    defineField({ name: "doors", type: "number", group: "specs" }),
    defineField({ name: "seats", type: "number", group: "specs" }),
    defineField({ name: "warranty", type: "string", group: "specs" }),
    defineField({ name: "serviceHistory", type: "string", group: "specs" }),

    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "shortDescription",
      type: "text",
      rows: 2,
      group: "media",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "description",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "features",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "object",
          name: "featureGroup",
          fields: [
            defineField({
              name: "category",
              type: "string",
              options: list(FEATURE_CATEGORIES),
              validation: (r) => r.required(),
            }),
            defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "string" })] }),
          ],
          preview: {
            select: { title: "category", items: "items" },
            prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} items` }),
          },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Newest", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", price: "price", status: "status", media: "images.0" },
    prepare: ({ title, price, status, media }) => ({
      title,
      subtitle: [price ? `AED ${price.toLocaleString("en-US")}` : null, status].filter(Boolean).join(" · "),
      media,
    }),
  },
});
