/**
 * LoginModal - Modal đăng nhập/đăng ký
 * Hỗ trợ các flows:
 *  - OPTIONS: chọn phương thức đăng nhập
 *  - EMAIL_LOGIN: đăng nhập bằng email/password
 *  - EMAIL_REGISTER: đăng ký tài khoản mới
 *  - TWO_FA: nhập OTP 2FA sau khi login
 *  - FORGOT_PASSWORD: nhập email để nhận OTP reset mật khẩu
 *  - RESET_PASSWORD: nhập OTP + mật khẩu mới
 *  - EMAIL_VERIFY: xác thực email sau khi đăng ký
 */
import {
  Modal, Button, Stack, Text, Title, Divider, Group,
  TextInput, PasswordInput, Box, CloseButton, PinInput, Alert, Loader, Center,
} from '@mantine/core';
import { IconBrandGoogle, IconArrowLeft, IconMail, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores';
import { authApi, profileApi } from '@/shared/services';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

type ModalView =
  | 'OPTIONS'
  | 'EMAIL_LOGIN'
  | 'EMAIL_REGISTER'
  | 'TWO_FA'
  | 'FORGOT_PASSWORD'
  | 'RESET_PASSWORD'
  | 'EMAIL_VERIFY';

export function LoginModal({ opened, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<ModalView>('OPTIONS');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { setLoginResponse, setUser } = useAuthStore();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView('OPTIONS');
      setErrorMsg('');
    }, 200);
  };

  // Sau login thành công: fetch profile, đóng modal
  const onLoginSuccess = async () => {
    try {
      const profile = await profileApi.getProfile();
      setUser(profile);
    } catch {
      // ignore profile fetch error — user vẫn đã đăng nhập
    }
    handleClose();
    navigate('/');
    notifications.show({
      title: 'Đăng nhập thành công',
      message: 'Chào mừng bạn trở lại!',
      color: 'green',
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      size={520}
      padding={0}
      radius="lg"
      withCloseButton={false}
    >
      <Box pos="relative" p="xl">
        <CloseButton
          onClick={handleClose}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
          size="lg"
        />

        {view === 'OPTIONS' && (
          <OptionsView
            onEmailLogin={() => setView('EMAIL_LOGIN')}
            onEmailRegister={() => setView('EMAIL_REGISTER')}
            onGoogleLogin={async () => {
              notifications.show({ message: 'Google Login chưa được cấu hình.', color: 'orange' });
            }}
          />
        )}

        {view === 'EMAIL_LOGIN' && (
          <EmailLoginForm
            loading={loading}
            errorMsg={errorMsg}
            onBack={() => { setView('OPTIONS'); setErrorMsg(''); }}
            onRegisterClick={() => { setView('EMAIL_REGISTER'); setErrorMsg(''); }}
            onForgotPassword={() => { setView('FORGOT_PASSWORD'); setErrorMsg(''); }}
            onSubmit={async (email, password) => {
              setLoading(true);
              setErrorMsg('');
              try {
                const resp = await authApi.login({ email, password });
                setLoginResponse(resp);
                if (resp.accessTokenType === 'TWO_FA_VERIFY') {
                  setView('TWO_FA');
                } else if (resp.accessTokenType === 'EMAIL_VERIFY') {
                  setView('EMAIL_VERIFY');
                } else {
                  await onLoginSuccess();
                }
              } catch (e: unknown) {
                const msg = extractErrorMessage(e, 'Email hoặc mật khẩu không đúng.');
                setErrorMsg(msg);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {view === 'EMAIL_REGISTER' && (
          <EmailRegisterForm
            loading={loading}
            errorMsg={errorMsg}
            onBack={() => { setView('OPTIONS'); setErrorMsg(''); }}
            onSignInClick={() => { setView('EMAIL_LOGIN'); setErrorMsg(''); }}
            onSubmit={async (values) => {
              setLoading(true);
              setErrorMsg('');
              try {
                await authApi.register(values);
                notifications.show({
                  title: 'Đăng ký thành công',
                  message: 'Bạn có thể đăng nhập ngay bây giờ.',
                  color: 'green',
                });
                setView('EMAIL_LOGIN');
              } catch (e: unknown) {
                setErrorMsg(extractErrorMessage(e, 'Đăng ký thất bại. Vui lòng thử lại.'));
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {view === 'TWO_FA' && (
          <TwoFAForm
            loading={loading}
            errorMsg={errorMsg}
            onBack={() => { setView('EMAIL_LOGIN'); setErrorMsg(''); }}
            onSubmit={async (otp) => {
              setLoading(true);
              setErrorMsg('');
              try {
                const resp = await authApi.authenticate2FA(otp);
                setLoginResponse(resp);
                await onLoginSuccess();
              } catch (e: unknown) {
                setErrorMsg(extractErrorMessage(e, 'Mã OTP không đúng. Vui lòng thử lại.'));
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {view === 'FORGOT_PASSWORD' && (
          <ForgotPasswordForm
            loading={loading}
            errorMsg={errorMsg}
            onBack={() => { setView('EMAIL_LOGIN'); setErrorMsg(''); }}
            onSubmit={async (email) => {
              setLoading(true);
              setErrorMsg('');
              try {
                const resp = await authApi.forgotPassword(email);
                // Lưu temp token vào store để gọi reset-password
                setLoginResponse(resp);
                if (resp.accessTokenType === 'PASSWORD_RESET') {
                   setView('RESET_PASSWORD');
                }
              } catch (e: unknown) {
                setErrorMsg(extractErrorMessage(e, 'Email không tồn tại trong hệ thống.'));
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {view === 'RESET_PASSWORD' && (
          <ResetPasswordForm
            loading={loading}
            errorMsg={errorMsg}
            onBack={() => { setView('FORGOT_PASSWORD'); setErrorMsg(''); }}
            onSubmit={async (otp, newPassword) => {
              setLoading(true);
              setErrorMsg('');
              try {
                await authApi.resetPassword(otp, newPassword);
                notifications.show({
                  title: 'Đặt lại mật khẩu thành công',
                  message: 'Bạn có thể đăng nhập với mật khẩu mới.',
                  color: 'green',
                });
                setView('EMAIL_LOGIN');
              } catch (e: unknown) {
                setErrorMsg(extractErrorMessage(e, 'OTP không đúng hoặc đã hết hạn.'));
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {view === 'EMAIL_VERIFY' && (
          <EmailVerifyForm
            loading={loading}
            errorMsg={errorMsg}
            onSubmit={async (otp) => {
              setLoading(true);
              setErrorMsg('');
              try {
                await authApi.verifyEmail(otp);
                notifications.show({ title: 'Xác thực thành công', message: 'Email đã được xác thực.', color: 'green' });
                handleClose();
              } catch (e: unknown) {
                setErrorMsg(extractErrorMessage(e, 'OTP không đúng.'));
              } finally {
                setLoading(false);
              }
            }}
            onResend={async () => {
              try {
                await authApi.sendVerificationEmail();
                notifications.show({ message: 'Đã gửi lại OTP xác thực email.', color: 'blue' });
              } catch {
                notifications.show({ message: 'Không thể gửi lại OTP.', color: 'red' });
              }
            }}
          />
        )}
      </Box>
    </Modal>
  );
}

// ─────────────── Helper ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractErrorMessage(e: unknown, fallback: string): string {
  const err = e as any;
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

// ─────────────── Sub-components ──────────────────────────────────────────────

function FormHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <Group mb="lg" align="center">
      <Button variant="subtle" size="md" p={0} onClick={onBack} c="dark" style={{ width: 32, height: 32 }}>
        <IconArrowLeft size={24} />
      </Button>
      <Title order={3} size="h2" fw={700} style={{ flex: 1 }}>{title}</Title>
    </Group>
  );
}

function ErrorAlert({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <Alert color="red" radius="md" mb="sm">
      {msg}
    </Alert>
  );
}

// ─── OPTIONS VIEW ────────────────────────────────────────────────────────────

interface OptionsViewProps {
  onEmailLogin: () => void;
  onEmailRegister: () => void;
  onGoogleLogin: () => void;
}

function OptionsView({ onEmailLogin, onEmailRegister, onGoogleLogin }: OptionsViewProps) {
  return (
    <Stack gap="md" px="md" pt="xs" pb="md">
      <Box mb="md">
        <Title order={2} ta="center" size="h2" fw={700}>Welcome to Docube</Title>
        <Text c="dimmed" ta="center" size="sm" mt={4}>Sign in to access study resources</Text>
      </Box>

      <Button
        variant="default"
        size="lg"
        radius="xl"
        leftSection={<IconBrandGoogle size={20} />}
        fullWidth
        onClick={onGoogleLogin}
        styles={{ root: { height: 50, borderColor: '#e0e0e0' }, inner: { fontSize: 16, fontWeight: 500, color: '#333' } }}
      >
        Continue with Google
      </Button>

      <Divider label="or continue with email" labelPosition="center" my="xs" />

      <Group grow preventGrowOverflow={false} wrap="nowrap" gap="md">
        <Button
          variant="outline"
          size="lg"
          radius="xl"
          onClick={onEmailLogin}
          styles={{ root: { height: 50, paddingLeft: 10, paddingRight: 10 }, label: { overflow: 'visible', whiteSpace: 'nowrap' } }}
        >
          Sign in with Email
        </Button>
        <Button
          variant="default"
          size="lg"
          radius="xl"
          onClick={onEmailRegister}
          styles={{ root: { height: 50, borderColor: '#e0e0e0', paddingLeft: 10, paddingRight: 10 }, label: { overflow: 'visible', whiteSpace: 'nowrap' } }}
        >
          Register with Email
        </Button>
      </Group>

      <Text c="dimmed" size="xs" ta="center" mt="sm">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </Stack>
  );
}

// ─── EMAIL LOGIN FORM ────────────────────────────────────────────────────────

interface EmailLoginFormProps {
  loading: boolean;
  errorMsg: string;
  onBack: () => void;
  onRegisterClick: () => void;
  onForgotPassword: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
}

function EmailLoginForm({ loading, errorMsg, onBack, onRegisterClick, onForgotPassword, onSubmit }: EmailLoginFormProps) {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Email không hợp lệ'),
      password: (v) => (v.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự'),
    },
  });

  return (
    <Stack px="md" pt="xs" pb="md">
      <FormHeader title="Đăng nhập" onBack={onBack} />
      <ErrorAlert msg={errorMsg} />
      <form onSubmit={form.onSubmit((v) => onSubmit(v.email, v.password))}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            {...form.getInputProps('email')}
            radius="md"
            size="md"
          />
          <PasswordInput
            label="Mật khẩu"
            placeholder="••••••••"
            {...form.getInputProps('password')}
            radius="md"
            size="md"
          />
          <Group justify="flex-end" mt={-6}>
            <Text size="sm" c="blue" style={{ cursor: 'pointer' }} onClick={onForgotPassword}>
              Quên mật khẩu?
            </Text>
          </Group>
          <Button type="submit" fullWidth mt="sm" size="lg" radius="xl" loading={loading}>
            Đăng nhập
          </Button>
          <Text c="dimmed" size="sm" ta="center" mt="xs">
            Chưa có tài khoản?{' '}
            <Text span c="blue" fw={700} style={{ cursor: 'pointer' }} onClick={onRegisterClick}>
              Đăng ký miễn phí!
            </Text>
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}

// ─── EMAIL REGISTER FORM ─────────────────────────────────────────────────────

interface RegisterValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
}

interface EmailRegisterFormProps {
  loading: boolean;
  errorMsg: string;
  onBack: () => void;
  onSignInClick: () => void;
  onSubmit: (values: RegisterValues) => Promise<void>;
}

function EmailRegisterForm({ loading, errorMsg, onBack, onSignInClick, onSubmit }: EmailRegisterFormProps) {
  const form = useForm<RegisterValues>({
    initialValues: { email: '', firstName: '', lastName: '', password: '', phoneNumber: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Email không hợp lệ'),
      firstName: (v) => (v.trim().length > 0 ? null : 'Vui lòng nhập tên'),
      lastName: (v) => (v.trim().length > 0 ? null : 'Vui lòng nhập họ'),
      password: (v) => {
        if (v.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(v)) return 'Mật khẩu phải có ít nhất 1 chữ cái và 1 số';
        return null;
      },
    },
  });

  return (
    <Stack px="md" pt="xs" pb="md">
      <FormHeader title="Đăng ký" onBack={onBack} />
      <ErrorAlert msg={errorMsg} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <Group grow>
            <TextInput label="Họ" placeholder="Nguyễn" {...form.getInputProps('lastName')} radius="md" size="md" />
            <TextInput label="Tên" placeholder="Văn A" {...form.getInputProps('firstName')} radius="md" size="md" />
          </Group>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            {...form.getInputProps('email')}
            radius="md"
            size="md"
          />
          <PasswordInput label="Mật khẩu" placeholder="••••••••" {...form.getInputProps('password')} radius="md" size="md" />
          <TextInput label="Số điện thoại (tùy chọn)" placeholder="+84..." {...form.getInputProps('phoneNumber')} radius="md" size="md" />
          <Button type="submit" fullWidth mt="sm" size="lg" radius="xl" loading={loading}>
            Đăng ký miễn phí
          </Button>
          <Text c="dimmed" size="sm" ta="center" mt="xs">
            Đã có tài khoản?{' '}
            <Text span c="blue" fw={700} style={{ cursor: 'pointer' }} onClick={onSignInClick}>Đăng nhập</Text>
          </Text>
          <Text c="dimmed" size="xs" ta="center" mt="sm">
            Khi đăng ký, bạn đồng ý với <Text span td="underline">Điều khoản dịch vụ</Text> và{' '}
            <Text span td="underline">Chính sách bảo mật</Text> của Docube.
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}

// ─── TWO-FA FORM ─────────────────────────────────────────────────────────────

interface TwoFAFormProps {
  loading: boolean;
  errorMsg: string;
  onBack: () => void;
  onSubmit: (otp: string) => Promise<void>;
}

function TwoFAForm({ loading, errorMsg, onBack, onSubmit }: TwoFAFormProps) {
  const [otp, setOtp] = useState('');
  return (
    <Stack px="md" pt="xs" pb="md">
      <FormHeader title="Xác thực 2 lớp" onBack={onBack} />
      <Text c="dimmed" size="sm">
        Nhập mã 6 chữ số từ ứng dụng Google Authenticator của bạn.
      </Text>
      <ErrorAlert msg={errorMsg} />
      <Center mt="sm">
        <PinInput
          length={6}
          type="number"
          size="lg"
          value={otp}
          onChange={setOtp}
          onComplete={(val) => onSubmit(val)}
        />
      </Center>
      {loading && <Center mt="sm"><Loader size="sm" /></Center>}
      <Button
        fullWidth
        mt="md"
        size="lg"
        radius="xl"
        loading={loading}
        disabled={otp.length !== 6}
        onClick={() => onSubmit(otp)}
      >
        Xác thực
      </Button>
    </Stack>
  );
}

// ─── FORGOT PASSWORD FORM ────────────────────────────────────────────────────

interface ForgotPasswordFormProps {
  loading: boolean;
  errorMsg: string;
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
}

function ForgotPasswordForm({ loading, errorMsg, onBack, onSubmit }: ForgotPasswordFormProps) {
  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Email không hợp lệ'),
    },
  });
  return (
    <Stack px="md" pt="xs" pb="md">
      <FormHeader title="Quên mật khẩu" onBack={onBack} />
      <Text c="dimmed" size="sm">
        Nhập email của bạn. Chúng tôi sẽ gửi OTP để đặt lại mật khẩu.
      </Text>
      <ErrorAlert msg={errorMsg} />
      <form onSubmit={form.onSubmit((v) => onSubmit(v.email))}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            {...form.getInputProps('email')}
            radius="md"
            size="md"
          />
          <Button type="submit" fullWidth mt="sm" size="lg" radius="xl" loading={loading}>
            Gửi OTP
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

// ─── RESET PASSWORD FORM ─────────────────────────────────────────────────────

interface ResetPasswordFormProps {
  loading: boolean;
  errorMsg: string;
  onBack: () => void;
  onSubmit: (otp: string, newPassword: string) => Promise<void>;
}

function ResetPasswordForm({ loading, errorMsg, onBack, onSubmit }: ResetPasswordFormProps) {
  const form = useForm({
    initialValues: { otp: '', newPassword: '', confirmPassword: '' },
    validate: {
      otp: (v) => (/^\d+$/.test(v) && v.length >= 4 ? null : 'OTP không hợp lệ'),
      newPassword: (v) => {
        if (v.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(v)) return 'Phải có ít nhất 1 chữ cái và 1 số';
        return null;
      },
      confirmPassword: (v, values) => (v === values.newPassword ? null : 'Mật khẩu không khớp'),
    },
  });
  return (
    <Stack px="md" pt="xs" pb="md">
      <FormHeader title="Đặt lại mật khẩu" onBack={onBack} />
      <Text c="dimmed" size="sm">Nhập OTP đã được gửi đến email và mật khẩu mới của bạn.</Text>
      <ErrorAlert msg={errorMsg} />
      <form onSubmit={form.onSubmit((v) => onSubmit(v.otp, v.newPassword))}>
        <Stack gap="md">
          <TextInput label="OTP" placeholder="Nhập mã OTP" {...form.getInputProps('otp')} radius="md" size="md" />
          <PasswordInput label="Mật khẩu mới" placeholder="••••••••" {...form.getInputProps('newPassword')} radius="md" size="md" />
          <PasswordInput label="Xác nhận mật khẩu" placeholder="••••••••" {...form.getInputProps('confirmPassword')} radius="md" size="md" />
          <Button type="submit" fullWidth mt="sm" size="lg" radius="xl" loading={loading}>
            Đặt lại mật khẩu
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

// ─── EMAIL VERIFY FORM ───────────────────────────────────────────────────────

interface EmailVerifyFormProps {
  loading: boolean;
  errorMsg: string;
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

function EmailVerifyForm({ loading, errorMsg, onSubmit, onResend }: EmailVerifyFormProps) {
  const [otp, setOtp] = useState('');
  return (
    <Stack px="md" pt="xs" pb="md">
      <Box mb="md">
        <Title order={3} size="h2" fw={700}>Xác thực Email</Title>
        <Text c="dimmed" size="sm" mt={4}>Nhập OTP đã được gửi đến email của bạn.</Text>
      </Box>
      <ErrorAlert msg={errorMsg} />
      <Center>
        <PinInput length={6} type="number" size="lg" value={otp} onChange={setOtp} onComplete={(v) => onSubmit(v)} />
      </Center>
      {loading && <Center mt="sm"><Loader size="sm" /></Center>}
      <Button fullWidth mt="md" size="lg" radius="xl" loading={loading} disabled={otp.length !== 6} onClick={() => onSubmit(otp)}
        leftSection={<IconCheck size={16} />}>
        Xác thực
      </Button>
      <Text ta="center" size="sm" c="dimmed">
        Không nhận được OTP?{' '}
        <Text span c="blue" style={{ cursor: 'pointer' }} onClick={onResend}>Gửi lại</Text>
      </Text>
    </Stack>
  );
}
