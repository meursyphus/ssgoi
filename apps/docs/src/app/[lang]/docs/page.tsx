// This page should not be reached due to middleware redirect
// Keeping it as a fallback in case of edge cases
export default async function DocsIndexPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to SSGOI Documentation
      </h1>
      <p className="text-gray-600">Redirecting to documentation...</p>
    </div>
  );
}
