import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChatAssistantProvider } from "@/modules/assistant/features/chat_assistant/context/provider";
import { HistorySidebar } from "./components/HistorySidebar";
import { Sheet, SheetContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { cn } from "@/utilities";

export default function AssistantLayout() {
    const [desktopPanelOpen, setDesktopPanelOpen] = useState(true);
    const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
    const ws = JSON.parse(localStorage.getItem("CURRENT_WORKSPACE") || "null");

    if (!ws) return <Outlet />;

    const workspaceId = ws.id || ws.public_id;

    return (
        <ChatAssistantProvider>
            <div className="w-full h-screen overflow-hidden bg-background">
                {/* Desktop Sidebar - Only visible on xl screens */}
                <div className={cn(
                    "hidden xl:block fixed left-0 top-0 bottom-0 w-80 border-r border-border/50 bg-card z-40 transition-transform duration-300",
                    desktopPanelOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <HistorySidebar workspaceId={workspaceId} />
                </div>

                {/* Mobile Sheet - Only on screens smaller than xl */}
                <div className="xl:hidden">
                    <Sheet open={mobilePanelOpen} onOpenChange={setMobilePanelOpen}>
                        <SheetContent side="left" className="w-80 max-w-xs p-0 [&>button]:hidden">
                            <HistorySidebar workspaceId={workspaceId} onClose={() => setMobilePanelOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Main Content */}
                <div className={cn(
                    "transition-all duration-300 h-full",
                    desktopPanelOpen ? "xl:pl-80" : "xl:pl-0"
                )}>
                    <div className="relative h-full">
                        {/* Toggle Button - Different behavior for mobile vs desktop */}
                        <div className="absolute top-0 left-0 z-50 px-4 pt-2 xl:px-2 xl:pt-2">
                            <Button
                                variant="secondary"
                                className="size-7 items-center justify-center shadow-sm"
                                onClick={() => {
                                    // Check screen size
                                    const isDesktop = window.innerWidth >= 1280; // xl breakpoint
                                    if (isDesktop) {
                                        setDesktopPanelOpen(!desktopPanelOpen);
                                    } else {
                                        setMobilePanelOpen(true);
                                    }
                                }}
                            >
                                {(!desktopPanelOpen) ? (
                                    <PanelLeftOpen className="size-4" />
                                ) : (
                                    <PanelLeftClose className="size-4" />
                                )}
                            </Button>
                        </div>

                        <Outlet />
                    </div>
                </div>
            </div>
        </ChatAssistantProvider>
    );
}
