/**
 * Router Configuration - Cấu hình routes cho ứng dụng
 * Sử dụng react-router-dom v6+
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layouts";
import { AuthGuard } from "./AuthGuard";

// Pages
import { NotFoundPage } from "@/features/errors";
import { SettingsPage } from "@/features/settings";
import { HomePage } from "@/features/home";
import { TestPage } from "@/features/test";
import { UniversityPage } from "@/features/university/UniversityPage";
import { SchoolDetailPage } from "@/features/school-detail/SchoolDetailPage";

/**
 * Routes configuration
 * - Public routes: Login, Register, ...
 * - Private routes: Home, Users, Settings, ... (wrapped với AuthGuard)
 */
export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "university",
        element: <UniversityPage />,
      },
      {
        path: "university/:slug",
        element: <SchoolDetailPage />,
      },
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
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "users",
        element: <HomePage />, // Tạm dùng HomePage
      },
      {
        path: "test",
        element: <TestPage />,
      },
    ],
  },

  // 404 Not Found
  {
    path: "/404",
    element: <NotFoundPage />,
  },

  // Redirect tất cả các routes không tồn tại về 404
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);
