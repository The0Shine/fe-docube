import { Paper, Title, Stack, Text, Group, Divider, Box } from '@mantine/core';
// Icons unused removed

export function SchoolSidebar() {
  return (
    <Stack gap="xl">
        {/* Content Categories -- imitating correct layout from screenshot */}
      <Paper withBorder p="md" radius="md">
        <Title order={3} size="h4" mb="md">Content categories</Title>
        <Stack gap="md">
            <Group justify="space-between">
                <Text size="sm" c="dimmed">Total documents</Text>
                <Text size="sm" fw={600}>14,640</Text>
            </Group>
            <Divider />
             <Group justify="space-between">
                <Text size="sm" c="dimmed">Lecture notes</Text>
                <Text size="sm" fw={600}>2,231</Text>
            </Group>
             <Divider />
            <Group justify="space-between">
                <Text size="sm" c="dimmed">Summaries</Text>
                <Text size="sm" fw={600}>601</Text>
            </Group>
        </Stack>
      </Paper>

      {/* University Details */}
      <Paper withBorder p="md" radius="md">
        <Title order={3} size="h4" mb="md">University details</Title>
        <Stack gap="sm">
            <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Website</Text>
                <Text size="sm" c="blue" component="a" href="https://hvtc.edu.vn" target="_blank">
                    hvtc.edu.vn
                </Text>
            </Box>
            <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Student population</Text>
                <Text size="sm">17,500</Text>
            </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

