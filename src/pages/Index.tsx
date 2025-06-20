import { AppSidebar } from "@/components/app-sidebar"
import RightSidebar from "@/components/RightSidebar"
import { RightSidebarProvider, RightSidebarTrigger } from "@/components/RightSidebarProvider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import RichEditor from "@/components/RichEditor";
import { ConnectionsPanelContainer } from "@/components/ConnectionsPanelContainer";
import { useTheme } from "next-themes";
import { useState, useRef } from "react"; // Added useRef
import { NotesProvider, useNotes } from "@/contexts/NotesContext";
import { EntityManagerDrawer } from "@/components/entity-manager/EntityManagerDrawer";
import { toggleDarkModeWithAnimation } from "@/lib/theme-utils"; // Added
import { Button } from "@/components/ui/button"; // Added
import { Sun, Moon } from "lucide-react"; // Added

function NotesApp() {
  const { theme, setTheme } = useTheme(); // Get theme and setTheme
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [connectionsOpen, setConnectionsOpen] = useState(true);
  const { selectedNote, updateNoteContent } = useNotes();
  const toggleButtonRef = useRef<HTMLButtonElement>(null); // Create ref for the button

  const handleEditorChange = (content: string) => {
    if (selectedNote) {
      updateNoteContent(selectedNote.id, content);
    }
  };

  // Handler for the theme toggle
  const handleThemeToggle = () => {
    // Ensure theme is either 'light' or 'dark' before passing to toggleDarkModeWithAnimation
    const currentTheme = theme === 'system' ?
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : (theme as 'light' | 'dark');

    toggleDarkModeWithAnimation(currentTheme, setTheme, toggleButtonRef);
  };

  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Notes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {selectedNote ? selectedNote.title : 'Select a note'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto flex items-center gap-2">
                {/* Theme Toggle Button */}
                <Button
                  ref={toggleButtonRef}
                  variant="outline"
                  size="icon"
                  onClick={handleThemeToggle}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <EntityManagerDrawer />
                <RightSidebarTrigger />
              </div>
            </header>
            
            <div className="flex-1 flex flex-col min-h-0">
              {selectedNote ? (
                <>
                  <div className="flex-1 min-h-0">
                    <RichEditor
                      content={selectedNote.content}
                      onChange={handleEditorChange}
                      // Pass resolved theme to RichEditor
                      isDarkMode={theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)}
                      toolbarVisible={toolbarVisible}
                      onToolbarVisibilityChange={setToolbarVisible}
                      noteId={selectedNote.id}
                    />
                  </div>
                  <ConnectionsPanelContainer 
                    isOpen={connectionsOpen}
                    onToggle={() => setConnectionsOpen(!connectionsOpen)}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a note to start editing
                </div>
              )}
            </div>
          </SidebarInset>
          <RightSidebar />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  );
}

const Index = () => {
  return (
    <NotesProvider>
      <NotesApp />
    </NotesProvider>
  )
}

export default Index
