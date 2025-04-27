import { PageHeader } from "@/components/page-header";

export default function NotesPage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <PageHeader title="Notes" description="Save your notes and thoughts" />
      <div className="flex-1">
        <iframe
          src="https://app.bangle.io/ws#route=ws-home&wsName=Main" // or point at a specific link
          title="Bangle.io"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
