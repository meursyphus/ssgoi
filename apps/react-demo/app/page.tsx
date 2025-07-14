import TempDemo from "./temp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Hello world!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Tailwind CSS is working properly!
        </p>
        <TempDemo />
      </div>
    </div>
  );
}
