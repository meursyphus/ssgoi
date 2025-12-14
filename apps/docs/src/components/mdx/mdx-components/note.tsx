export const Note = ({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) => {
  return (
    <div className="my-4 bg-zinc-800/40 px-4 py-3 text-sm text-zinc-400">
      {children}
    </div>
  );
};
