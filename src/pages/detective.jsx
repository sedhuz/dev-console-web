export default function DetectivePage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Detective</h1>
          <p className="text-sm text-muted-foreground">
            Manage your detective investigations
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src="not-found.svg"
          alt="Detective Illustration"
          className="w-1/2 max-w-md"
        />
        <h1 className="text-6xl leading-none font-extrabold">
          Not implemented yet!
        </h1>
        <p className="text-3xl font-semibold text-muted-foreground mt-4">
          As no open docs for detective API is available
        </p>
      </div>
    </div>
  );
}
