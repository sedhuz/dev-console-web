import { PageHeader } from "@/components/page-header";

export default function DiagramsPage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <PageHeader title="Diagrams" description="Save diagrams and flowcharts" />
      {/* Excalidraw embed, takes up the rest of the page */}
      <div className="flex-1">
        <iframe
          src="https://excalidraw.com" // or point at a specific share link: e.g. "https://excalidraw.com/#json=<yourExportedJSON>"
          title="Excalidraw Editor"
          frameBorder="0"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
