import { Sidebar } from "@/components/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}