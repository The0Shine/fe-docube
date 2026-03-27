import { Container, Title, Text, TextInput, Box, Stack, useMantineTheme } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export function SchoolHero() {
  const theme = useMantineTheme();
  
  return (
    <Box 
      h={300} 
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', // Dark fallback
      }}
    >
        {/* Background Overlay - Simulating the blurred image/gradient from screenshot */}
        <Box
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e021fc9e27f0?q=80&w=2670&auto=format&fit=crop")', // Placeholder uni image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px) brightness(0.7)',
                zIndex: 1
            }}
        />

      <Container size="xl" style={{ position: 'relative', zIndex: 10, height: '100%' }}>
        <Stack justify="center" h="100%" gap="xl">
            {/* School Info */}
          <Box>
            <Title order={1} c="white" size={32} fw={700}>
                Học viện Tài chính
            </Title>
            <Text c="white" fw={700} size="xl">AOF</Text>
          </Box>

          {/* Search Bar */}
          <TextInput
            size="xl"
            radius="xl"
            placeholder="Search for courses, quizzes, or documents"
            rightSection={<IconSearch size={20} />}
            w="100%"
            maw={800}
            styles={{
                input: {
                    height: '56px',
                    fontSize: '16px',
                    paddingLeft: '24px',
                    boxShadow: theme.shadows.lg,
                }
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
