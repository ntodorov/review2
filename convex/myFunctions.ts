import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// Helper function to generate a random application number
function generateApplicationNumber() {
  const prefix = "AER";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}-${random}`;
}

// You can read data from the database via a query:
export const listApplications = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query("applications");

    if (args.status !== undefined) {
      return await query
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(100);
    }

    return await query.order("desc").take(100);
  },
});

export const getApplication = query({
  args: {
    id: v.id("applications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// You can write data to the database via a mutation:
export const addApplication = mutation({
  args: {
    applicationNumber: v.optional(v.string()),
    companyName: v.string(),
    projectType: v.string(),
    description: v.string(),
    location: v.string(),
    documents: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const submissionDate = Date.now();
    const reviewDeadline = submissionDate + 30 * 24 * 60 * 60 * 1000; // 30 days from submission

    await ctx.db.insert("applications", {
      ...args,
      applicationNumber: args.applicationNumber ?? generateApplicationNumber(),
      status: "Under Review",
      submissionDate,
      reviewDeadline,
    });
  },
});

export const updateApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    companyName: v.optional(v.string()),
    projectType: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
    assignedReviewer: v.optional(v.string()),
    documents: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { applicationId, ...updates } = args;
    await ctx.db.patch(applicationId, updates);
  },
});

export const deleteApplication = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.applicationId);
  },
});

// Function to add sample applications
export const addSampleApplications = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleCompanies = [
      "Canadian Natural Resources Limited",
      "Suncor Energy Inc.",
      "Imperial Oil Limited",
      "Cenovus Energy Inc.",
      "Enbridge Inc.",
    ];

    const sampleProjects = [
      "Pipeline Construction",
      "Well Drilling",
      "Water Usage",
      "Land Access",
      "Facility Expansion",
    ];

    const sampleLocations = [
      "Fort McMurray, AB",
      "Edmonton, AB",
      "Calgary, AB",
      "Grande Prairie, AB",
      "Red Deer, AB",
    ];

    const sampleDescriptions = [
      "New pipeline construction project for oil transportation",
      "Drilling of new well for natural gas extraction",
      "Water usage application for industrial processes",
      "Land access request for exploration activities",
      "Expansion of existing processing facility",
    ];

    // Add 5 sample applications
    for (let i = 0; i < 5; i++) {
      await ctx.db.insert("applications", {
        applicationNumber: generateApplicationNumber(),
        companyName: sampleCompanies[i],
        projectType: sampleProjects[i],
        description: sampleDescriptions[i],
        location: sampleLocations[i],
        status: "Under Review",
        submissionDate: Date.now() - i * 24 * 60 * 60 * 1000, // Stagger submission dates
        reviewDeadline: Date.now() + (30 - i) * 24 * 60 * 60 * 1000, // Stagger review deadlines
        documents: [`document_${i + 1}.pdf`],
      });
    }
  },
});
