import { Container, Title, Text, TextInput, Stack, Box } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export function UniversityHero() {
  return (
    <Box bg="white" pt={40} pb={60}>
      <Container size="md">
        <Stack align="center" gap="lg">
          {/* Illustration Placeholder */}
          <Box 
            w={120} 
            h={120} 
            style={{ 
                borderRadius: '50%', 
                background: '#DBEAFE', // Light blue for university
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
          >
             <Text size="50px">🎓</Text>
          </Box>

          <Stack gap={4} align="center">
            <Title order={1} size={32} fw={800} ta="center">
              What university do you study at?
            </Title>
            <Text c="dimmed" size="md">
              Search for a university and find study materials
            </Text>
          </Stack>

          <TextInput
            size="xl"
            radius="xl"
            placeholder="Type to start searching"
            rightSection={<IconSearch size={22} color="gray" />}
            w="100%"
            maw={600}
            styles={{
                input: {
                    border: '1px solid #E2E8F0',
                    fontSize: '16px',
                    height: '56px',
                    paddingLeft: '24px'
                }
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
