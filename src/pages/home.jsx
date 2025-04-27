import { PageHeader } from "@/components/page-header";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <PageHeader
        title="Dev Console"
        description="Welcome to the Dev Console"
      />
    </div>
  );
}
