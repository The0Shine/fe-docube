import { Container, Title, Box, Stack, Group, Text, Anchor } from '@mantine/core';
import { UniversityHero } from './components/UniversityHero';
import { SchoolList } from './components/SchoolList';
import { POPULAR_UNIVERSITIES } from './types';
import { IconChevronRight } from '@tabler/icons-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function UniversityPage() {
  return (
    <Box bg="white" style={{ minHeight: '100vh' }}>
      <UniversityHero />
      
      <Container size="lg" py="xl">
        <Stack gap={40}>
          {/* Most Popular Schools */}
          <Box>
            <Title order={2} size="h3" mb="lg">Most popular universities</Title>
            <SchoolList schools={POPULAR_UNIVERSITIES} />
          </Box>

          {/* All Schools */}
          <Box>
            <Title order={2} size="h3" mb="md">All universities</Title>
            <Text size="sm" c="dimmed" mb="md">Search for your university by its first letter</Text>
            
            {/* Alphabet Filter */}
            <Group gap={4} mb="xl" wrap="wrap">
              {ALPHABET.map((char) => (
                <Anchor 
                    key={char} 
                    href={`#${char}`} 
                    fw={600} 
                    p={8} 
                    size="sm"
                    style={{ 
                        borderRadius: '4px',
                        textDecoration: 'none'
                    }}
                >
                    {char}
                </Anchor>
              ))}
               <IconChevronRight size={16} color="gray" />
            </Group>
            
            {/* Can re-use SchoolList or render mock list for "All" */}
            <SchoolList schools={POPULAR_UNIVERSITIES.slice(0, 10)} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
