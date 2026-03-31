/**
 * Router Configuration - Cấu hình routes cho ứng dụng
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layouts";
import { AuthGuard } from "./AuthGuard";

// Public pages
import { NotFoundPage } from "@/features/errors";
import { HomePage } from "@/features/home";
import { UniversityPage } from "@/features/university/UniversityPage";
import { SchoolDetailPage } from "@/features/school-detail/SchoolDetailPage";
import { DocumentsPage } from "@/features/documents";
import { DocumentDetailPage } from "@/features/document-detail";

// Private pages
import { ProfilePage } from "@/features/profile";
import { UploadDocumentPage } from "@/features/upload";
import { MyDocumentsPage, EditDocumentPage } from "@/features/my-documents";
import { BookmarksPage } from "@/features/bookmarks";
import { PurchasesPage } from "@/features/purchases";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "documents", element: <DocumentsPage /> },
      { path: "documents/:id", element: <DocumentDetailPage /> },
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
      { path: "upload", element: <UploadDocumentPage /> },
      { path: "my-documents", element: <MyDocumentsPage /> },
      { path: "my-documents/:id/edit", element: <EditDocumentPage /> },
      { path: "bookmarks", element: <BookmarksPage /> },
      { path: "purchases", element: <PurchasesPage /> },
    ],
  },

  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
