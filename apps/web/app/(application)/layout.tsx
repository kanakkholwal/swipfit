import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { getSession } from "~/lib/auth-server"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <SidebarProvider>
      <AppSidebar user={session?.user} />
      <SidebarInset className="flex-1 w-full relative z-0">
        <nav className="w-full sticky top-0 flex h-20 shrink-0 items-center px-4 bg-card z-50 backdrop-blur-md gap-2 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
          <SidebarTrigger className="-ml-1" />
          <Link href="/search" className="relative group rounded-md w-full cursor-pointer max-w-2xl border hover:border-primary hover:shadow hover:bg-card">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 cursor-pointer size-5 text-muted-foreground group-target:text-primary" />
            <Input
              className="h-11 min-w-full pl-10 bg-background group-hover:bg-inherit cursor-pointer"
              placeholder="Search..."
              readOnly
            
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="icon_sm"
              >
                <SlidersHorizontal />
              </Button>
            </div>
          </Link>
          {session?.user ? (
            <div className="ml-auto">

              {/* <DropdownMenu>
            <DropdownMenuTrigger> */}
              <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {session?.user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* <span className="truncate font-semibold">{session?.user?.name}</span> */}
              {/* </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
            </div>
          ) : <div className="flex gap-2 ml-auto">
            <Button
              asChild
            >
              <Link href="/sign-in">Log In</Link>
            </Button>

          </div>}


        </nav>
        <main className="content z-2 @container space-y-10 min-h-screen h-full bg-accent">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
