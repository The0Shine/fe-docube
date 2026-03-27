/**
 * AuthGuard - Component bảo vệ các private routes
 * Kiểm tra trạng thái đăng nhập và hiển thị LoginModal nếu chưa đăng nhập
 */
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { profileApi } from '@/shared/services';
import { Center, Loader } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { 
    isAuthenticated, 
    accessToken, 
    setUser, 
    user, 
    setLoginModalOpen 
  } = useAuthStore();
  const [validating, setValidating] = useState(false);

  // Nếu có token nhưng chưa có user profile → fetch profile
  useEffect(() => {
    if (accessToken && isAuthenticated && !user) {
      setValidating(true);
      profileApi.getProfile()
        .then((profile) => setUser(profile))
        .catch(() => {
          // Token không hợp lệ — store sẽ bị clear bởi axios interceptor
        })
        .finally(() => setValidating(false));
    }
  }, [accessToken, isAuthenticated, user, setUser]);

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
