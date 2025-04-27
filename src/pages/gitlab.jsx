import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { MergeRequestBoard } from "@/components/gitlab/mr-board";

const initialColumns = {
  pending: {
    title: "Pending Review",
    items: [
      {
        id: "1",
        iid: "MR-421",
        title: "Update user authentication",
        author: "John Doe",
        hasNotes: false,
        notes: "",
        branch: "feature/auth-update",
        url: "https://gitlab.com/project/merge_requests/421",
        tags: ["frontend", "security"],
        status: "pending",
      },
      {
        id: "2",
        iid: "MR-422",
        title: "Fix navigation bug",
        author: "Jane Smith",
        hasNotes: true,
        notes: "Need to test on mobile",
        branch: "bugfix/nav-issues",
        url: "https://gitlab.com/project/merge_requests/422",
        tags: ["bug", "ui"],
        status: "pending",
      },
    ],
  },
  inProgress: {
    title: "In Progress",
    items: [
      {
        id: "3",
        iid: "MR-420",
        title: "Add dark mode support",
        author: "Mike Johnson",
        hasNotes: false,
        notes: "",
        branch: "feature/dark-mode",
        url: "https://gitlab.com/project/merge_requests/420",
        tags: ["frontend", "enhancement"],
        status: "in-progress",
      },
    ],
  },
  completed: {
    title: "Completed",
    items: [
      {
        id: "4",
        iid: "MR-419",
        title: "Implement search feature",
        author: "Sarah Wilson",
        hasNotes: true,
        notes: "Deployed to staging",
        branch: "feature/search",
        url: "https://gitlab.com/project/merge_requests/419",
        tags: ["frontend", "backend"],
        status: "merged",
      },
    ],
  },
};

export default function GitlabPage() {
  const [columns, setColumns] = useState(initialColumns);

  const handleColumnUpdate = (updatedColumns) => {
    setColumns(updatedColumns);
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
