"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Layers, ChevronRight, Menu, X, List, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarContext,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Tools",
    items: [
      {
        title: "Document Generator",
        href: "/dokumen-generator",
        icon: FileText,
      },
      {
        title: "SOP Builder",
        href: "/sop-builder",
        icon: Layers,
      },
      {
        title: "List SOP",
        href: "/my-sops",
        icon: List,
      },
    ],
  },
];

function SidebarContentInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen } = useContext(SidebarContext);


  return (
    <>
      <Sidebar>
        <SidebarHeader>
          {isOpen ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image src="/logo-isidoku.png" alt="IsiDoku Logo" width={32} height={32} className="object-cover" />
                </div>
                <span className="font-black tracking-tight">IsiDoku</span>
              </div>
              <SidebarTrigger />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src="/logo-isidoku.png" alt="IsiDoku Logo" width={32} height={32} className="object-cover" />
              </div>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          {navigation.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        variant={isActive ? "active" : "default"}
                      >
                        <Link href={item.href}>
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {isOpen && <span className="truncate">{item.title}</span>}
                          {isOpen && isActive && <ChevronRight className="ml-auto w-4 h-4 flex-shrink-0" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          {isOpen ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    localStorage.removeItem('isiDoku_geminiApiKey');
                    router.push("/");
                  }}
                  className="text-black border-2 border-transparent hover:bg-yellow-300 hover:text-black hover:border-black"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <SidebarTrigger />
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardLayoutContent isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  children,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const { isOpen } = useContext(SidebarContext);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, setIsMobileMenuOpen]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop: always show, Mobile: show when open */}
      <div className={`${isMobileMenuOpen ? "fixed" : "hidden"} lg:relative lg:block z-50 lg:z-auto h-full`}>
        <SidebarContentInner />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="border-b-2 border-black bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu trigger */}
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-black hover:text-white rounded-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side navigation */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-black bg-white px-6 py-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <span>© {new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', year: 'numeric' })} IsiDoku</span>
            <span>Made With ❤️ by <a href="https://albertas.my.id" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Albert Assidiq</a></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
