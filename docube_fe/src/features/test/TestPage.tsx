/**
 * Home Page - Trang chủ sau khi đăng nhập
 * Demo Design System với full color palette
 */
import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Group,
  Badge,
  Button,
  Progress,
  Stack,
  Paper,
  ThemeIcon,
  Alert,
  Divider,
  Box,
} from '@mantine/core';
import {
  IconUsers,
  IconFileAnalytics,
  IconCoin,
  IconArrowUpRight,
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores';

export function TestPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  // Mock data cho dashboard cards - sử dụng semantic colors
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      diff: 12,
      icon: IconUsers,
      color: 'info',
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      diff: 8,
      icon: IconCoin,
      color: 'success',
    },
    {
      title: 'Total Reports',
      value: '567',
      diff: -3,
      icon: IconFileAnalytics,
      color: 'warning',
    },
  ];

  return (
    <Stack gap="lg">
      {/* Welcome section */}
      <Paper p="md" radius="md" withBorder>
        <Title order={2}>{t('home.welcome')}, {user?.name}!</Title>
        <Text c="dimmed" mt="xs">
          {t('home.description')}
        </Text>
      </Paper>

      {/* Stats cards - Demo semantic colors */}
      <Title order={3}>{t('home.dashboard')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {stats.map((stat) => (
          <Card key={stat.title} withBorder padding="lg" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {stat.title}
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {stat.value}
                </Text>
              </div>
              <ThemeIcon size={46} radius="md" variant="light" color={stat.color}>
                <stat.icon size={26} />
              </ThemeIcon>
            </Group>

            <Group mt="md" gap="xs">
              <Badge
                color={stat.diff > 0 ? 'success' : 'danger'}
                variant="light"
                leftSection={<IconArrowUpRight size={12} />}
              >
                {stat.diff}%
              </Badge>
              <Text size="xs" c="dimmed">
                vs last month
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Alerts - Demo semantic colors */}
      <Title order={3}>Alerts & Notifications</Title>
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Alert icon={<IconCheck size={20} />} title="Success!" color="success" variant="light">
          Your changes have been saved successfully.
        </Alert>
        <Alert icon={<IconAlertTriangle size={20} />} title="Warning!" color="warning" variant="light">
          Please review your input before proceeding.
        </Alert>
        <Alert icon={<IconX size={20} />} title="Error!" color="danger" variant="light">
          Something went wrong. Please try again.
        </Alert>
        <Alert icon={<IconInfoCircle size={20} />} title="Info" color="info" variant="light">
          This is some helpful information for you.
        </Alert>
      </SimpleGrid>

      {/* Buttons - Demo all colors */}
      <Title order={3}>Button Variants</Title>
      <Card withBorder p="lg">
        <Stack gap="md">
          <Group>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
            <Button color="info">Info</Button>
            <Button color="accent">Accent</Button>
          </Group>

          <Divider label="Light variant" />
          <Group>
            <Button variant="light" color="primary">Primary</Button>
            <Button variant="light" color="secondary">Secondary</Button>
            <Button variant="light" color="success">Success</Button>
            <Button variant="light" color="warning">Warning</Button>
            <Button variant="light" color="danger">Danger</Button>
            <Button variant="light" color="info">Info</Button>
            <Button variant="light" color="accent">Accent</Button>
          </Group>

          <Divider label="Outline variant" />
          <Group>
            <Button variant="outline" color="primary">Primary</Button>
            <Button variant="outline" color="secondary">Secondary</Button>
            <Button variant="outline" color="success">Success</Button>
            <Button variant="outline" color="danger">Danger</Button>
          </Group>
        </Stack>
      </Card>

      {/* Badges - Demo all colors */}
      <Title order={3}>Badges</Title>
      <Card withBorder p="lg">
        <Group>
          <Badge color="primary" size="lg">Primary</Badge>
          <Badge color="secondary" size="lg">Secondary</Badge>
          <Badge color="success" size="lg">Success</Badge>
          <Badge color="warning" size="lg">Warning</Badge>
          <Badge color="danger" size="lg">Danger</Badge>
          <Badge color="info" size="lg">Info</Badge>
          <Badge color="accent" size="lg">Accent</Badge>
        </Group>
      </Card>

      {/* Progress bars - Demo all colors */}
      <Title order={3}>Progress Bars</Title>
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <div>
            <Group justify="space-between" mb={5}>
              <Text size="sm">Primary - 75%</Text>
            </Group>
            <Progress value={75} color="primary" />
          </div>
          <div>
            <Group justify="space-between" mb={5}>
              <Text size="sm">Success - 90%</Text>
            </Group>
            <Progress value={90} color="success" />
          </div>
          <div>
            <Group justify="space-between" mb={5}>
              <Text size="sm">Warning - 45%</Text>
            </Group>
            <Progress value={45} color="warning" />
          </div>
          <div>
            <Group justify="space-between" mb={5}>
              <Text size="sm">Danger - 25%</Text>
            </Group>
            <Progress value={25} color="danger" />
          </div>
          <div>
            <Group justify="space-between" mb={5}>
              <Text size="sm">Info - 60%</Text>
            </Group>
            <Progress value={60} color="info" />
          </div>
          <div>
            <Group justify="space-between" mb={5}>
              <Text size="sm">Accent - 80%</Text>
            </Group>
            <Progress value={80} color="accent" />
          </div>
        </Stack>
      </Card>

      {/* Color Swatches */}
      <Title order={3}>Color Palette</Title>
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 7 }}>
        {['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'accent'].map((color) => (
          <Card key={color} withBorder p="sm">
            <Stack gap="xs">
              <Box
                h={60}
                style={{
                  backgroundColor: `var(--mantine-color-${color}-5)`,
                  borderRadius: 'var(--mantine-radius-md)',
                }}
              />
              <Text size="sm" fw={500} ta="center" tt="capitalize">
                {color}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
