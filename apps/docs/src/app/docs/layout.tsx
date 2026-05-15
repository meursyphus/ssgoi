import { getNavigationData } from "@/lib/post";
import { Sidebar } from "./sidebar";
import { NavigationSetter } from "@/components/layout/navigation-setter";
import { DocsSsgoi, SsgoiTransition } from "@/components/docs/ssgoi";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const navigation = await getNavigationData();

  return (
    <>
      <NavigationSetter navigation={navigation} />
      <SsgoiTransition
        id="/ssgoi/docs"
        as="div"
        className="min-h-[calc(100vh-4rem)] page"
      >
        <div className="mx-auto pt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <Sidebar navigation={navigation} />
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <div className="py-8">
                <div className="mx-auto max-w-4xl relative overflow-hidden z-0">
                  <DocsSsgoi navigation={navigation}>{children}</DocsSsgoi>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SsgoiTransition>
    </>
  );
}
