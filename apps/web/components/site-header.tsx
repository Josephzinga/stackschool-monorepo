import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from './DropMenu';
import { SearchInput } from '@/components/search-input';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="flex h-16 sticky top-1 left-0 right-0 z-40 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex ml-10 items-center flex-1 w-[75%]">
          <div className="hidden md:block">
            <SearchInput
              className="h-12 font-poppins "
              placeholder="Rechercher..."
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-[25%] gap-4">
          <ModeToggle className="w-10 h-10" />
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 border-primary border"
          >
            <Bell />
          </Button>
        </div>
      </div>
    </header>
  );
}
