"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Alberta Energy Regulator - Applications Review
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          AER Applications Review System
        </h1>
        <ApplicationsTable />
      </main>
    </>
  );
}

function ApplicationsTable() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null,
  );
  const applications = useQuery(api.myFunctions.listApplications, {
    status: statusFilter,
  });
  const addApplication = useMutation(api.myFunctions.addApplication);
  const updateApplication = useMutation(api.myFunctions.updateApplication);
  const deleteApplication = useMutation(api.myFunctions.deleteApplication);
  const addSampleApplications = useMutation(
    api.myFunctions.addSampleApplications,
  );

  if (!applications) {
    return <div className="text-center">Loading applications...</div>;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Applications</h2>
        <div className="flex gap-4">
          <select
            className="p-2 border rounded"
            value={statusFilter ?? ""}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            aria-label="Filter applications by status"
          >
            <option value="">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Additional Info Required">
              Additional Info Required
            </option>
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowAddForm(true)}
          >
            Add Application
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => void addSampleApplications()}
          >
            Add Sample Data
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Add New Application</h3>
            <ApplicationForm
              onSubmit={async (data) => {
                await addApplication(data);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Application #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Project Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Submission Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Review Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {applications.map((app) => (
              <tr
                key={app._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {app.applicationNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {app.companyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {app.projectType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    className="p-1 border rounded"
                    value={app.status}
                    onChange={(e) => {
                      void updateApplication({
                        applicationId: app._id,
                        status: e.target.value,
                      });
                    }}
                    aria-label={`Update status for application ${app.applicationNumber}`}
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Additional Info Required">
                      Additional Info Required
                    </option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(app.submissionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(app.reviewDeadline)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {app.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() => setSelectedApplication(app._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this application?",
                          )
                        ) {
                          void deleteApplication({ applicationId: app._id });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Edit Application</h3>
            <ApplicationForm
              applicationId={selectedApplication}
              onSubmit={async (data) => {
                await updateApplication({
                  applicationId: selectedApplication,
                  ...data,
                });
                setSelectedApplication(null);
              }}
              onCancel={() => setSelectedApplication(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationForm({
  applicationId,
  onSubmit,
  onCancel,
}: {
  applicationId?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    companyName: "",
    projectType: "",
    description: "",
    location: "",
    documents: [""],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium mb-1">
          Company Name
        </label>
        <input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
          required
          aria-label="Company Name"
          placeholder="Enter company name"
        />
      </div>
      <div>
        <label htmlFor="projectType" className="block text-sm font-medium mb-1">
          Project Type
        </label>
        <input
          id="projectType"
          type="text"
          value={formData.projectType}
          onChange={(e) =>
            setFormData({ ...formData, projectType: e.target.value })
          }
          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
          required
          aria-label="Project Type"
          placeholder="Enter project type"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
          rows={3}
          required
          aria-label="Project Description"
          placeholder="Enter project description"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
          required
          aria-label="Project Location"
          placeholder="Enter project location"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {applicationId ? "Update" : "Add"} Application
        </button>
      </div>
    </form>
  );
}
