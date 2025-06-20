
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
import { useTheme } from "next-themes";
import { useState } from "react";

const Index = () => {
  const { theme } = useTheme();
  const [editorContent, setEditorContent] = useState('{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Welcome to your note editor! Try typing some notes with special syntax like #tags, [[wiki links]], or <<cross links>>."}]}]}');
  const [toolbarVisible, setToolbarVisible] = useState(true);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    console.log('Editor content changed:', content);
  };

  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
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
                    <BreadcrumbPage>Welcome</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto">
                <RightSidebarTrigger />
              </div>
            </header>
            
            <div className="flex-1 h-[calc(100vh-4rem)]">
              <RichEditor
                content={editorContent}
                onChange={handleEditorChange}
                isDarkMode={theme === 'dark'}
                toolbarVisible={toolbarVisible}
                onToolbarVisibilityChange={setToolbarVisible}
              />
            </div>
          </SidebarInset>
          <RightSidebar />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  )
}

export default Index
