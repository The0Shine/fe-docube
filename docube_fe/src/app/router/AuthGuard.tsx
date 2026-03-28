/**
 * AuthGuard - Component bảo vệ các private routes
 * Kiểm tra trạng thái đăng nhập và hiển thị LoginModal nếu chưa đăng nhập
 */
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { profileApi, authApi } from '@/shared/services';
import { Center, Loader } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const {
    isAuthenticated,
    accessToken,
    setUser,
    setRoles,
    user,
    setLoginModalOpen
  } = useAuthStore();
  // Khởi tạo đúng ngay từ đầu — tránh setState đồng bộ trong effect
  const needsFetch = Boolean(accessToken && isAuthenticated && !user);
  const [validating, setValidating] = useState(needsFetch);

  // Nếu có token nhưng chưa có user profile → fetch profile
  useEffect(() => {
    if (!needsFetch) return;
    Promise.all([profileApi.getProfile(), authApi.getMyRoles()])
      .then(([profile, roles]) => {
        setUser(profile);
        setRoles(roles);
      })
      .catch(() => {
        // Token không hợp lệ — store sẽ bị clear bởi axios interceptor
      })
      .finally(() => setValidating(false));
  }, [needsFetch, setUser, setRoles]);

  // Tự động mở modal nếu truy cập trang private mà chưa login
  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
       setLoginModalOpen(true);
    } else {
       setLoginModalOpen(false);
    }
  }, [isAuthenticated, accessToken, setLoginModalOpen]);

  if (validating) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
