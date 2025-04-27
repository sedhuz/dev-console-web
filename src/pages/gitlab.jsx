import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { MergeRequestBoard } from "@/components/gitlab/mr-board";
import { API_CONFIG } from "@/config"; // Ensure you have the API_CONFIG imported
import { toast } from "sonner";

export default function GitlabPage() {
  const [columns, setColumns] = useState({
    pending: { title: "Pending Review", items: [] },
    inProgress: { title: "In Progress", items: [] },
    completed: { title: "Completed", items: [] },
  });

  const handleColumnUpdate = (updatedColumns) => {
    setColumns(updatedColumns);
  };

  useEffect(() => {
    const fetchMergeRequests = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.baseUrl}/gitlab/merge-requests`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Parsed data:", data);

        const mergeRequests = data.data || [];
        const categorizedColumns = categorizeMergeRequests(mergeRequests);
        setColumns(categorizedColumns);
      } catch (error) {
        toast.error("Error fetching merge requests");
        console.error("Error fetching merge requests:", error);
      }
    };

    fetchMergeRequests();
  }, []);

  const categorizeMergeRequests = (mergeRequests) => {
    const categorized = {
      pending: { title: "Pending Review", items: [] },
      inProgress: { title: "In Progress", items: [] },
      completed: { title: "Completed", items: [] },
    };

    mergeRequests.forEach((mr) => {
      const group = mr.custom_fields.group || "default"; // Use default if no group
      console.log("Merge Request Group:", group); // Log the group value

      // Check if the group exists in categorized
      if (!categorized[group]) {
        console.warn(`Unexpected group: ${group}. Using 'pending' instead.`);
        categorized.pending = categorized.pending || {
          title: "Pending Review",
          items: [],
        };
        categorized.pending.items.push(mr);
      } else {
        categorized[group].items.push(mr);
      }
    });

    return categorized;
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <PageHeader
        title="Gitlab Dashboard"
        description="Manage your merge requests and track development progress"
      />

      <div className="flex-1 p-6">
        <MergeRequestBoard
          columns={columns}
          onColumnUpdate={handleColumnUpdate}
        />
      </div>
    </div>
  );
}
