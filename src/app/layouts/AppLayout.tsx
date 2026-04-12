  import { SideNav } from '@/widgets/side-nav';
import { BottomNav } from '@/widgets/bottom-nav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface lg:flex">
      <SideNav />
      <main className="flex-1 lg:pl-16">
        <div className="mx-auto max-w-2xl px-4
                        pt-[max(1rem,env(safe-area-inset-top))]
                        pb-[calc(5rem+env(safe-area-inset-bottom))]
                        pl-[max(1rem,env(safe-area-inset-left))]
                        pr-[max(1rem,env(safe-area-inset-right))]
                        lg:pt-8 lg:pb-8 lg:px-6
                        min-h-screen">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
