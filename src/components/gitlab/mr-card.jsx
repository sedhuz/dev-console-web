import { Copy, MessageCircle, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const tagColors = {
  frontend:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
  backend:
    "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800",
  bug: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800",
  enhancement:
    "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800",
  security:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800",
  ui: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800",
};

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "in-progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  merged: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  merged: "Merged",
};

export function MergeRequestCard({ mergeRequest, onAddNote, onCopy }) {
  const handleCopyMRID = () => {
    onCopy(mergeRequest.iid, "MR ID");
    toast.success(`Copied MR ID: ${mergeRequest.iid}`);
  };

  const handleCopyBranchName = () => {
    onCopy(mergeRequest.branch, "Branch name");
    toast.success(`Copied branch name: ${mergeRequest.branch}`);
  };

  const handleCopyURL = () => {
    onCopy(mergeRequest.url, "MR URL");
    toast.success(`Copied MR URL: ${mergeRequest.url}`);
  };

  return (
    <div className="bg-background rounded-md p-4 border shadow hover:shadow-md transition select-none">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-foreground">{mergeRequest.title}</h3>
        <Badge className={statusColors[mergeRequest.status]}>
          {statusLabels[mergeRequest.status]}
        </Badge>
      </div>

      <div className="flex items-center gap-1 mb-2">
        <Badge variant="outline" className="text-xs">
          {mergeRequest.iid}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground/75 bg-background hover:bg-background hover:cursor-pointer"
          onClick={handleCopyMRID}
        >
          <Copy size={12} />
        </Button>
      </div>

      <div className="flex items-center text-xs text-muted-foreground mb-3">
        <GitBranch size={14} className="mr-1" />
        <span className="truncate mr-1">{mergeRequest.branch}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground/75 bg-background hover:bg-background hover:cursor-pointer"
          onClick={handleCopyBranchName}
        >
          <Copy size={12} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {mergeRequest.tags.map((tag) => (
          <Badge
            key={tag}
            className={
              tagColors[tag] ||
              "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }
          >
            {tag}
          </Badge>
        ))}
      </div>

      {mergeRequest.hasNotes && (
        <div className="text-xs bg-gray-50 p-2 rounded border mb-3 dark:bg-gray-800 dark:text-gray-200">
          <p className="text-gray-700 dark:text-gray-300">
            {mergeRequest.notes}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={onAddNote}
          className="gap-1"
        >
          <MessageCircle size={14} />
          {mergeRequest.hasNotes ? "Edit Note" : "Add Note"}
        </Button>

        <Button variant="ghost" size="sm" onClick={handleCopyURL}>
          Copy URL
        </Button>
      </div>
    </div>
  );
}
