
import { AppSidebar } from "@/components/app-sidebar"
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

const Index = () => {
  return (
    <SidebarProvider>
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
            
            {/* Main editor area placeholder */}
            <Card className="flex-1 min-h-[60vh]">
              <CardHeader>
                <CardTitle>Note Editor</CardTitle>
                <CardDescription>
                  This is where your note editor will go. Select a note from the sidebar or create a new one to start editing.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-muted/20 rounded-lg h-full min-h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">📝</div>
                    <p>Select a note to start editing</p>
                    <p className="text-sm">or create a new note from the sidebar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Index
