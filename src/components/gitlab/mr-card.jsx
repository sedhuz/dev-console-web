import {
  MessageSquarePlus,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  GitBranch,
  Calendar,
  GripVertical,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, memo } from "react";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";

const TagColors = {
  backend: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  frontend:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  bug: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  security:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "high-priority":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  mobile:
    "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
};

const MRCardHeader = memo(({ mr, onAddNote, dragHandleProps }) => (
  <div className="flex items-start justify-between gap-2 p-0">
    <div className="flex-1 border-b pb-2 min-w-0">
      <div className="flex items-start gap-2">
        {mr.mrLink ? (
          <a
            href={mr.mrLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-m truncate hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {mr.title}
          </a>
        ) : (
          <h3 className="font-medium text-m truncate">{mr.title}</h3>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
        {mr.updatedAt && (
          <>
            <Calendar className="h-3 w-3" />
            <span>Updated {mr.updatedAt}</span>
          </>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onAddNote(mr.id);
        }}
      >
        {mr.hasNotes ? (
          <MessageSquare className="h-4 w-4" />
        ) : (
          <MessageSquarePlus className="h-4 w-4" />
        )}
      </Button>
      <div
        {...dragHandleProps}
        className="h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-accent/50 rounded-md transition-colors"
        onMouseDown={(e) => e.preventDefault()}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  </div>
));

const BranchInfo = memo(({ sourceBranch, targetBranch, onCopy, copied }) => (
  <div className="flex items-center gap-2 text-xs">
    <GitBranch className="h-3 w-3 text-muted-foreground flex-shrink-0" />
    <button
      onClick={onCopy}
      className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground"
    >
      <span className="truncate max-w-[150px]">{sourceBranch}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
      ) : (
        <Copy className="h-3 w-3 flex-shrink-0" />
      )}
    </button>
    <span className="text-muted-foreground">→</span>
    <span className="px-2 py-1 rounded-md bg-muted truncate max-w-[100px]">
      {targetBranch}
    </span>
  </div>
));

const Tags = memo(({ tags }) => (
  <div className="flex flex-wrap gap-1">
    {tags?.map((tag) => (
      <Badge
        key={tag}
        variant="secondary"
        className={cn(
          "text-xs px-2 py-0.5",
          TagColors[tag] ||
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        )}
      >
        {tag}
      </Badge>
    ))}
  </div>
));

export const MRCard = memo(({ mr, onAddNote, dragHandleProps }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyBranch = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(mr.sourceBranch);
      setCopied(true);
      toast.success("Branch name copied!", {
        className: "bg-zinc-900 border-l-4 border-green-500 text-white",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy branch name", {
        className: "bg-zinc-900 border-l-4 border-red-500 text-white",
        duration: 2000,
      });
    }
  };

  return (
    <div className="group bg-background border rounded-lg">
      <div className="p-4 space-y-3">
        <MRCardHeader
          mr={mr}
          onAddNote={onAddNote}
          dragHandleProps={dragHandleProps}
        />

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            {mr.sourceBranch && (
              <BranchInfo
                sourceBranch={mr.sourceBranch}
                targetBranch={mr.targetBranch}
                onCopy={handleCopyBranch}
                copied={copied}
              />
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="font-medium text-foreground">{mr.author}</span>
            </div>
          </div>

          {mr.tags && <Tags tags={mr.tags} />}
        </div>
      </div>

      {mr.hasNotes && mr.notes && (
        <div className="pt-0 px-4 pb-4">
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md border">
            {mr.notes}
          </div>
        </div>
      )}
    </div>
  );
});

MRCard.displayName = "MRCard";
