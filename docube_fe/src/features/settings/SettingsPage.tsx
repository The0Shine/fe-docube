/**
 * Settings Page - Trang cài đặt & Demo các tính năng
 */
import { useState } from 'react';
import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Group,
  Button,
  Stack,
  Paper,
  Divider,
  SegmentedControl,
  ColorSwatch,
  NumberInput,
  Slider,
  Select,
  Tabs,
  Code,
  Badge,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconPalette,
  IconBell,
  IconAlertTriangle,
  IconTrash,
  IconDownload,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconLoader,
  IconLanguage,
  IconMoon,
  IconUser,
  IconShieldLock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore, PRIMARY_COLORS } from '@/stores';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  updateToSuccess,
  updateToError,
  cleanAllNotifications,
} from '@/shared/utils/notifications';
import {
  showConfirm,
  showDeleteConfirm,
  closeAllModals,
} from '@/shared/utils/modals';
import {
  startProgress,
  completeProgress,
  setProgress,
  resetProgress,
} from '@/shared/utils/nprogress';
import { changeLanguage, SUPPORTED_LANGUAGES, type LanguageCode } from '@/shared/i18n';
import { ProfileSection } from './ProfileSection';
import { SecuritySection } from './SecuritySection';

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const { primaryColor, setPrimaryColor, toggleColorScheme } = useThemeStore();
  const [progressValue, setProgressValue] = useState(50);

  // Color mapping for display
  const colorMap: Record<string, string> = {
    primary: '#dc3545',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#f03e3e',
    info: '#17a2b8',
    accent: '#9c36b5',
  };

  return (
    <Stack gap="xl">
      <Paper p="md" withBorder>
        <Title order={2}>{t('sidebar.settings')}</Title>
        <Text c="dimmed" mt="xs">
          Cài đặt tài khoản và demo các tính năng của ứng dụng
        </Text>
      </Paper>

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShieldLock size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="theme" leftSection={<IconPalette size={16} />}>
            Theme & Colors
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="modals" leftSection={<IconAlertTriangle size={16} />}>
            Modals
          </Tabs.Tab>
          <Tabs.Tab value="progress" leftSection={<IconLoader size={16} />}>
            Progress
          </Tabs.Tab>
        </Tabs.List>

        {/* ==================== PROFILE TAB ==================== */}
        <Tabs.Panel value="profile" pt="md">
          <ProfileSection />
        </Tabs.Panel>

        {/* ==================== SECURITY TAB ==================== */}
        <Tabs.Panel value="security" pt="md">
          <SecuritySection />
        </Tabs.Panel>

        {/* ==================== THEME TAB ==================== */}
        <Tabs.Panel value="theme" pt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* Color Scheme */}
            <Card withBorder p="lg">
              <Group mb="md">
                <IconMoon size={20} />
                <Title order={4}>Color Scheme</Title>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Chuyển đổi giữa Light và Dark mode
              </Text>

              <Group>
                <SegmentedControl
                  value={colorScheme}
                  onChange={() => toggleColorScheme()}
                  data={[
                    { label: '☀️ Light', value: 'light' },
                    { label: '🌙 Dark', value: 'dark' },
                  ]}
                />
              </Group>

              <Text size="xs" c="dimmed" mt="md">
                Current: <Code>{colorScheme}</Code>
              </Text>
            </Card>

            {/* Language */}
            <Card withBorder p="lg">
              <Group mb="md">
                <IconLanguage size={20} />
                <Title order={4}>Language / Ngôn ngữ</Title>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Chọn ngôn ngữ hiển thị
              </Text>

              <Select
                value={i18n.language}
                onChange={(value) => value && changeLanguage(value as LanguageCode)}
                data={SUPPORTED_LANGUAGES.map((lang) => ({
                  value: lang.code,
                  label: `${lang.flag} ${lang.name}`,
                }))}
              />

              <Text size="xs" c="dimmed" mt="md">
                Current: <Code>{i18n.language}</Code>
              </Text>
            </Card>

            {/* Primary Color */}
            <Card withBorder p="lg">
              <Group mb="md">
                <IconPalette size={20} />
                <Title order={4}>Primary Color</Title>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Chọn màu chính cho ứng dụng
              </Text>

              <Group gap="xs">
                {PRIMARY_COLORS.map((color) => (
                  <Tooltip key={color} label={color} withArrow>
                    <ActionIcon
                      variant={primaryColor === color ? 'filled' : 'default'}
                      size="lg"
                      radius="md"
                      onClick={() => setPrimaryColor(color)}
                      style={{
                        backgroundColor: primaryColor === color ? colorMap[color] : undefined,
                      }}
                    >
                      <ColorSwatch
                        color={colorMap[color]}
                        size={20}
                        withShadow={false}
                      />
                    </ActionIcon>
                  </Tooltip>
                ))}
              </Group>

              <Text size="xs" c="dimmed" mt="md">
                Current: <Code>{primaryColor}</Code>
              </Text>
            </Card>

            {/* Color Palette Preview */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Color Palette Preview</Title>
              
              <Stack gap="xs">
                {Object.entries(colorMap).map(([name, hex]) => (
                  <Group key={name} gap="sm">
                    <ColorSwatch color={hex} size={24} />
                    <Text size="sm" w={80}>{name}</Text>
                    <Code>{hex}</Code>
                    <Badge color={name} size="sm">{name}</Badge>
                  </Group>
                ))}
              </Stack>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        <Tabs.Panel value="notifications" pt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* Basic Notifications */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Basic Notifications</Title>
              <Text size="sm" c="dimmed" mb="md">
                Test các loại notification cơ bản
              </Text>

              <Stack gap="sm">
                <Button
                  color="success"
                  leftSection={<IconCheck size={16} />}
                  onClick={() => showSuccess({ 
                    title: 'Thành công!',
                    message: 'Đây là notification thành công' 
                  })}
                >
                  Show Success
                </Button>

                <Button
                  color="danger"
                  leftSection={<IconX size={16} />}
                  onClick={() => showError({ 
                    title: 'Lỗi!',
                    message: 'Đây là notification lỗi' 
                  })}
                >
                  Show Error
                </Button>

                <Button
                  color="warning"
                  leftSection={<IconAlertTriangle size={16} />}
                  onClick={() => showWarning({ 
                    title: 'Cảnh báo!',
                    message: 'Đây là notification cảnh báo' 
                  })}
                >
                  Show Warning
                </Button>

                <Button
                  color="info"
                  leftSection={<IconInfoCircle size={16} />}
                  onClick={() => showInfo({ 
                    title: 'Thông tin',
                    message: 'Đây là notification thông tin' 
                  })}
                >
                  Show Info
                </Button>

                <Divider my="sm" />

                <Button
                  variant="outline"
                  color="secondary"
                  onClick={cleanAllNotifications}
                >
                  Clear All Notifications
                </Button>
              </Stack>
            </Card>

            {/* Loading Notifications */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Loading Notifications</Title>
              <Text size="sm" c="dimmed" mb="md">
                Test notification với loading state
              </Text>

              <Stack gap="sm">
                <Button
                  leftSection={<IconLoader size={16} />}
                  onClick={() => {
                    showLoading('demo-loading', 'Đang xử lý dữ liệu...');
                    
                    // Giả lập async operation
                    setTimeout(() => {
                      updateToSuccess('demo-loading', 'Xử lý hoàn tất!');
                    }, 2000);
                  }}
                >
                  Loading → Success (2s)
                </Button>

                <Button
                  color="danger"
                  variant="light"
                  leftSection={<IconLoader size={16} />}
                  onClick={() => {
                    showLoading('demo-loading-error', 'Đang tải dữ liệu...');
                    
                    setTimeout(() => {
                      updateToError('demo-loading-error', 'Không thể tải dữ liệu!');
                    }, 2000);
                  }}
                >
                  Loading → Error (2s)
                </Button>
              </Stack>

              <Divider my="md" label="Code Example" />
              
              <Code block>
{`// Show loading
showLoading('id', 'Loading...');

// Update to success
updateToSuccess('id', 'Done!');

// Update to error
updateToError('id', 'Failed!');`}
              </Code>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* ==================== MODALS TAB ==================== */}
        <Tabs.Panel value="modals" pt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* Confirm Modals */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Confirm Modals</Title>
              <Text size="sm" c="dimmed" mb="md">
                Test các loại confirm dialog
              </Text>

              <Stack gap="sm">
                <Button
                  onClick={() => showConfirm({
                    title: 'Xác nhận hành động',
                    message: 'Bạn có chắc chắn muốn thực hiện hành động này không?',
                    onConfirm: () => showSuccess({ message: 'Đã xác nhận!' }),
                    onCancel: () => showInfo({ message: 'Đã hủy' }),
                  })}
                >
                  Basic Confirm
                </Button>

                <Button
                  color="danger"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => showDeleteConfirm('Item Demo', () => {
                    showSuccess({ message: 'Đã xóa Item Demo!' });
                  })}
                >
                  Delete Confirm
                </Button>

                <Button
                  color="warning"
                  leftSection={<IconAlertTriangle size={16} />}
                  onClick={() => showConfirm({
                    title: 'Cảnh báo quan trọng!',
                    message: 'Hành động này có thể ảnh hưởng đến dữ liệu của bạn. Bạn có muốn tiếp tục?',
                    confirmLabel: 'Tiếp tục',
                    cancelLabel: 'Quay lại',
                    onConfirm: () => showWarning({ message: 'Đã tiếp tục!' }),
                    danger: true,
                  })}
                >
                  Warning Confirm
                </Button>

                <Divider my="sm" />

                <Button
                  variant="outline"
                  color="secondary"
                  onClick={closeAllModals}
                >
                  Close All Modals
                </Button>
              </Stack>
            </Card>

            {/* Modal Code Example */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Code Examples</Title>

              <Code block>
{`// Basic confirm
showConfirm({
  title: 'Confirm',
  message: 'Are you sure?',
  onConfirm: () => doSomething(),
});

// Delete confirm (preset)
showDeleteConfirm('Item Name', () => {
  deleteItem(id);
});

// Custom confirm
showConfirm({
  title: 'Warning',
  message: 'This is dangerous!',
  confirmLabel: 'Yes, do it',
  cancelLabel: 'No, go back',
  danger: true,
  onConfirm: () => dangerousAction(),
});`}
              </Code>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* ==================== PROGRESS TAB ==================== */}
        <Tabs.Panel value="progress" pt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* NProgress Controls */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Navigation Progress</Title>
              <Text size="sm" c="dimmed" mb="md">
                Progress bar hiển thị ở top của trang
              </Text>

              <Stack gap="sm">
                <Group>
                  <Button
                    color="primary"
                    onClick={startProgress}
                  >
                    Start Progress
                  </Button>
                  <Button
                    color="success"
                    onClick={completeProgress}
                  >
                    Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetProgress}
                  >
                    Reset
                  </Button>
                </Group>

                <Divider my="sm" label="Set Progress Value" />

                <Group align="end">
                  <NumberInput
                    label="Progress %"
                    value={progressValue}
                    onChange={(val) => setProgressValue(Number(val) || 0)}
                    min={0}
                    max={100}
                    step={10}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={() => setProgress(progressValue)}>
                    Set
                  </Button>
                </Group>

                <Slider
                  value={progressValue}
                  onChange={setProgressValue}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' },
                  ]}
                />

                <Divider my="sm" />

                <Button
                  leftSection={<IconDownload size={16} />}
                  onClick={async () => {
                    startProgress();
                    for (let i = 0; i <= 100; i += 10) {
                      setProgress(i);
                      await new Promise(resolve => setTimeout(resolve, 200));
                    }
                    completeProgress();
                    showSuccess({ message: 'Download completed!' });
                  }}
                >
                  Simulate Download
                </Button>
              </Stack>
            </Card>

            {/* Progress Code Example */}
            <Card withBorder p="lg">
              <Title order={4} mb="md">Code Examples</Title>

              <Code block>
{`import { 
  startProgress, 
  completeProgress,
  setProgress 
} from '@/shared/utils';

// Basic usage
startProgress();
await fetchData();
completeProgress();

// With progress value
startProgress();
setProgress(25);
// ... do something
setProgress(50);
// ... do more
setProgress(75);
// ... finish
completeProgress();`}
              </Code>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
