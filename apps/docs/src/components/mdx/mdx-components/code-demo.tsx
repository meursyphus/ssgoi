export const CodeDemo = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};
