import { ReactNode } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    </AuthGuard>
  );
}
