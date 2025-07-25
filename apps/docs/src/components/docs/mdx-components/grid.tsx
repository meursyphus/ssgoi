export const Grid = ({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: number;
}) => {
  return (
    <div className={`grid gap-4 my-6 grid-cols-1 md:grid-cols-${cols}`}>
      {children}
    </div>
  );
};