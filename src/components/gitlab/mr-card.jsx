import { MessageCircle, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const tagColors = {
  "DEPENDENCY - BOOKS REPO":
    "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200",
  "NO PENDING REVIEW":
    "bg-gray-700 text-white  dark:bg-gray-100 dark:text-gray-900",
  REVIEWED:
    "bg-violet-100 text-violet-800  dark:bg-violet-900 dark:text-violet-200",
  "GOOD TO MERGE":
    "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-200",
  "SECURITY REVIEW - NA":
    "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-200",
  MASTER: "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-200",
  CONSOLIDATED:
    "bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-200",
  "READY TO MERGE":
    "bg-cyan-100 text-cyan-800  dark:bg-cyan-900 dark:text-cyan-200",
  "INVESTIGATION COMPLETED":
    "bg-blue-100 text-blue-800  dark:bg-blue-900 dark:text-blue-200",
  "WORK ON HOLD":
    "bg-yellow-100 text-yellow-800  dark:bg-yellow-900 dark:text-yellow-200",
};

const statusColors = {
  opened:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "in-progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  merged: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const statusLabels = {
  opened: "Opened",
  "in-progress": "In Progress",
  merged: "Merged",
  closed: "Closed",
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
    onCopy(mergeRequest.web_url, "MR URL");
    toast.success(`Copied MR URL: ${mergeRequest.web_url}`);
  };

  const handleOpenGitLab = () => {
    window.open(mergeRequest.web_url, "_blank");
  };

  const MAX_NOTE_LENGTH = 38;

  return (
    <div className="bg-background rounded-md p-4 border shadow hover:shadow-md transition select-none">
      <div className="flex justify-between gap-2 items-start mb-2">
        <h3 className="font-medium text-foreground">
          {mergeRequest.title_formatted}
        </h3>
        <Badge className={statusColors[mergeRequest.state]}>
          {statusLabels[mergeRequest.state]}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className="text-xs text-muted-foreground hover:cursor-pointer hover:text-foreground transition-colors"
          onClick={handleCopyMRID}
        >
          ! {mergeRequest.iid}
        </Badge>

        {mergeRequest.has_conflicts && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="outline"
                  className="text-xs hover:cursor-pointer"
                >
                  ⚠️
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  This merge request has conflicts that need to be resolved.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-center text-xs text-muted-foreground mb-3">
        <GitBranch size={14} className="mr-1" />
        <span
          className="truncate text-s mr-2 hover:cursor-pointer hover:text-foreground transition-colors"
          onClick={handleCopyBranchName}
        >
          {mergeRequest.branch}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {mergeRequest.labels.map((tag) => (
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

      {mergeRequest.custom_fields.notes && (
        <div className="text-xs bg-green-100 dark:bg-green-900/10 p-2 px-3 rounded-md border-green-700 dark:border-green-900 border mb-3 max-h-12 overflow-hidden">
          <p className="text-green-700 dark:text-green-300">
            {mergeRequest.custom_fields.notes.length > MAX_NOTE_LENGTH
              ? `${mergeRequest.custom_fields.notes.substring(
                  0,
                  MAX_NOTE_LENGTH
                )}...`
              : mergeRequest.custom_fields.notes}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={onAddNote}
          className="gap-1 hover:cursor-pointer"
        >
          <MessageCircle size={14} />
          {mergeRequest.hasNotes ? "Edit Note" : "Add Note"}
        </Button>

        <div className="flex items-center hover:cursor-pointer">
          <div className="flex border border-faded rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyURL}
              className="rounded-l-md rounded-r-none hover:bg-gray-200 hover:cursor-pointer"
            >
              🔗
            </Button>
            <div className="border-l border-faded" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenGitLab}
              className="rounded-r-md rounded-l-none hover:bg-gray-200 hover:cursor-pointer"
            >
              🦊
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
