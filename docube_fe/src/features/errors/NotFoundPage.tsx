/**
 * Not Found Page (404) - Trang hiển thị khi không tìm thấy route
 */
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { IconHome, IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Stack align="center" gap="lg" style={{ width: '100%' }}>
        {/* 404 Text */}
        <Title
          order={1}
          style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1 }}
          c="dimmed"
        >
          404
        </Title>

        {/* Error message */}
        <Title order={2} ta="center">
          {t('notFound.title')}
        </Title>

        <Text c="dimmed" size="lg" ta="center" maw={500}>
          {t('notFound.description')}
        </Text>

        {/* Action buttons */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          <Button leftSection={<IconHome size={18} />} onClick={() => navigate('/')}>
            {t('notFound.backHome')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
