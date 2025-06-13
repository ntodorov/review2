import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  applications: defineTable({
    applicationNumber: v.string(),
    companyName: v.string(),
    projectType: v.string(),
    status: v.string(),
    submissionDate: v.number(),
    description: v.string(),
    location: v.string(),
    reviewDeadline: v.number(),
    assignedReviewer: v.optional(v.string()),
    documents: v.array(v.string()),
  }).index("by_status", ["status"]),
});
