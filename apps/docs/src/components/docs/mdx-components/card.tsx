export const Card = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      )}
      <div className="text-gray-300">{children}</div>
    </div>
  );
};