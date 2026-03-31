import { Box, Container, Title, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDocumentStore } from '@/stores';

export function DocumentsHero() {
  const { searchQuery, setSearchQuery } = useDocumentStore();

  return (
    <Box
      py={64}
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-primary-6) 0%, var(--mantine-color-primary-8) 100%)',
      }}
    >
      <Container size="md">
        <Title order={1} c="white" ta="center" fw={800} mb={12}>
          📚 Kho tài liệu
        </Title>
        <Text c="white" ta="center" size="lg" mb={32} style={{ opacity: 0.9 }}>
          Tìm kiếm tài liệu học tập từ các trường đại học
        </Text>
        <TextInput
          placeholder="Tìm kiếm tài liệu..."
          leftSection={<IconSearch size={18} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          size="lg"
          radius="xl"
          styles={{
            input: {
              paddingLeft: 48,
              fontSize: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: 'none',
            },
          }}
        />
      </Container>
    </Box>
  );
}
