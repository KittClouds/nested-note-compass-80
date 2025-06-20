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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
            
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Get started with your notes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-muted/50 h-8 rounded flex items-center px-3 text-sm">Create New Note</div>
                      <div className="bg-muted/50 h-8 rounded flex items-center px-3 text-sm">New Folder</div>
                      <div className="bg-muted/50 h-8 rounded flex items-center px-3 text-sm">Import Notes</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Your latest note updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-muted/50 h-6 rounded"></div>
                      <div className="bg-muted/50 h-6 rounded"></div>
                      <div className="bg-muted/50 h-6 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistics</CardTitle>
                    <CardDescription>Your note-taking progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-muted/50 h-6 rounded"></div>
                      <div className="bg-muted/50 h-6 rounded"></div>
                      <div className="bg-muted/50 h-6 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Rich Text Editor */}
              <Card className="flex-1 min-h-[60vh]">
                <CardHeader>
                  <CardTitle>Note Editor</CardTitle>
                  <CardDescription>
                    Start writing your notes with rich text formatting and special syntax support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="h-full">
                    <RichEditor
                      content={editorContent}
                      onChange={handleEditorChange}
                      isDarkMode={theme === 'dark'}
                      toolbarVisible={toolbarVisible}
                      onToolbarVisibilityChange={setToolbarVisible}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
          <RightSidebar />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  )
}

export default Index
