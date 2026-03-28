/**
 * Router Configuration - Cấu hình routes cho ứng dụng
 * Sử dụng react-router-dom v6+
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layouts";
import { AuthGuard } from "./AuthGuard";

// Pages
import { NotFoundPage } from "@/features/errors";
import { ProfilePage } from "@/features/profile";
import { HomePage } from "@/features/home";
import { TestPage } from "@/features/test";
import { UniversityPage } from "@/features/university/UniversityPage";
import { SchoolDetailPage } from "@/features/school-detail/SchoolDetailPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "university", element: <UniversityPage /> },
      { path: "university/:slug", element: <SchoolDetailPage /> },
    ],
  },

  // Private routes - Cần đăng nhập
  {
    path: "/private",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: "profile", element: <ProfilePage /> },
      { path: "users", element: <HomePage /> },
      { path: "test", element: <TestPage /> },
    ],
  },

  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
