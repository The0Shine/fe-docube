import { useState } from "react";
import { Alert, Badge, Button, Card, Center, Divider, Group, Loader, PinInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconShieldCheck, IconShieldOff, IconShieldLock } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { profileApi } from "@/shared/services";
import type { TotpSetupResponse, UserSummary } from "@/shared/types";

interface TwoFACardProps {
  user: UserSummary;
  onUpdated: (updated: UserSummary) => void;
}

type View = "idle" | "setup" | "disable";

export function TwoFACard({ user, onUpdated }: TwoFACardProps) {
  const is2FAEnabled = !!user.twoFaEnabled;
  const [view, setView] = useState<View>("idle");
  const [totpData, setTotpData] = useState<TotpSetupResponse | null>(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSetup = async () => {
    setIsLoading(true);
    try {
      const data = await profileApi.setup2FA();
      setTotpData(data);
      setView("setup");
    } catch {
      notifications.show({ message: "Không thể khởi tạo 2FA. Thử lại sau.", color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySetup = async (val: string) => {
    if (isLoading || val.length !== 6) return;
    setIsLoading(true);
    try {
      const updated = await profileApi.verify2FASetup(val);
      onUpdated(updated);
      setView("idle");
      setTotpData(null);
      setOtp("");
      notifications.show({ title: "Đã bật xác thực 2 lớp", message: "Tài khoản của bạn được bảo vệ tốt hơn.", color: "green" });
    } catch {
      setOtp("");
      notifications.show({ message: "Mã OTP không đúng. Vui lòng thử lại.", color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async (val: string) => {
    if (isLoading || val.length !== 6) return;
    setIsLoading(true);
    try {
      const updated = await profileApi.disable2FA(val);
      onUpdated(updated);
      setView("idle");
      setOtp("");
      notifications.show({ message: "Đã tắt xác thực 2 lớp.", color: "orange" });
    } catch {
      setOtp("");
      notifications.show({ message: "Mã OTP không đúng.", color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setView("idle");
    setTotpData(null);
    setOtp("");
  };

  return (
    <Card withBorder p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconShieldLock size={18} color="#dc3545" />
          <Title order={5}>Xác thực 2 lớp (2FA)</Title>
        </Group>
        <Badge
          color={is2FAEnabled ? "success" : "gray"}
          variant="light"
          leftSection={is2FAEnabled ? <IconShieldCheck size={12} /> : <IconShieldOff size={12} />}
        >
          {is2FAEnabled ? "Đã bật" : "Chưa bật"}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        Tăng cường bảo mật tài khoản bằng Google Authenticator hoặc ứng dụng TOTP tương tự.
      </Text>

      {/* Idle state */}
      {view === "idle" && (
        <Group>
          {!is2FAEnabled && (
            <Button
              color="primary"
              leftSection={<IconShieldCheck size={15} />}
              loading={isLoading}
              onClick={handleStartSetup}
            >
              Bật 2FA
            </Button>
          )}
          {is2FAEnabled && (
            <Button
              color="red"
              variant="light"
              leftSection={<IconShieldOff size={15} />}
              onClick={() => setView("disable")}
            >
              Tắt 2FA
            </Button>
          )}
        </Group>
      )}

      {/* Setup flow */}
      {view === "setup" && totpData && (
        <Stack gap="md">
          <Alert color="blue" radius="md">
            Quét mã QR bằng <strong>Google Authenticator</strong> hoặc nhập secret key thủ công.
          </Alert>

          <Center>
            <QRCodeSVG value={totpData.qrCodeUrl} size={180} />
          </Center>

          <TextInput
            label="Secret key (nhập thủ công)"
            value={totpData.secret}
            readOnly
            radius="md"
            styles={{ input: { fontFamily: "monospace", letterSpacing: "0.05em" } }}
          />

          <Divider label="Sau khi quét, nhập mã OTP để xác nhận" labelPosition="center" />

          <Center>
            <PinInput
              length={6}
              type="number"
              value={otp}
              onChange={(val) => setOtp(val.replace(/\D/g, ""))}
              onComplete={handleVerifySetup}
              disabled={isLoading}
            />
          </Center>

          {isLoading && <Center><Loader size="sm" color="primary" /></Center>}

          <Group>
            <Button
              color="primary"
              onClick={() => handleVerifySetup(otp)}
              loading={isLoading}
              disabled={otp.length !== 6}
            >
              Xác nhận & Bật 2FA
            </Button>
            <Button variant="subtle" color="gray" onClick={handleCancel}>
              Hủy
            </Button>
          </Group>
        </Stack>
      )}

      {/* Disable flow */}
      {view === "disable" && (
        <Stack gap="md">
          <Text size="sm">Nhập mã OTP từ Google Authenticator để tắt 2FA:</Text>
          <Center>
            <PinInput
              length={6}
              type="number"
              value={otp}
              onChange={(val) => setOtp(val.replace(/\D/g, ""))}
              onComplete={handleDisable}
              disabled={isLoading}
            />
          </Center>
          {isLoading && <Center><Loader size="sm" /></Center>}
          <Group>
            <Button
              color="red"
              onClick={() => handleDisable(otp)}
              loading={isLoading}
              disabled={otp.length !== 6}
            >
              Tắt 2FA
            </Button>
            <Button variant="subtle" color="gray" onClick={handleCancel}>
              Hủy
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  );
}
