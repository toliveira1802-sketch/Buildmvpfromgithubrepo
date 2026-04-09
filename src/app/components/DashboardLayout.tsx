import { Outlet, useNavigate, useLocation } from "react-router";
import { cn } from "@/app/shared/ui/utils";
import { Button } from "@/app/shared/ui/button";
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  PlusCircle, 
  LogOut,
  Menu,
  X,
  Users
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detecta se está no contexto admin ou normal
  const isAdminRoute = location.pathname.startsWith("/admin");

  const menuItems = isAdminRoute
    ? [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/patio", label: "Pátio Kanban", icon: Car },
        { path: "/admin/clientes", label: "Clientes", icon: Users },
        { path: "/admin/ordens-servico", label: "Ordens de Serviço", icon: FileText },
        { path: "/admin/nova-os", label: "Nova OS", icon: PlusCircle },
      ]
    : [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/dashboard/patio", label: "Pátio Kanban", icon: Car },
        { path: "/dashboard/ordens", label: "Ordens de Serviço", icon: FileText },
        { path: "/dashboard/nova-os", label: "Nova OS", icon: PlusCircle },
      ];

  const handleLogout = () => {
    localStorage.removeItem("dap-user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border"
      )}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png"
              alt="Doctor Auto Logo"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-semibold text-sidebar-foreground">
                Doctor Auto
              </h1>
              <p className="text-xs text-muted-foreground">
                Sistema de Gestão
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="size-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png"
                  alt="Doctor Auto Logo"
                  className="w-8 h-8"
                />
                <div>
                  <h1 className="text-lg font-semibold text-sidebar-foreground">
                    Doctor Auto
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Sistema de Gestão
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-6" />
          </Button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}