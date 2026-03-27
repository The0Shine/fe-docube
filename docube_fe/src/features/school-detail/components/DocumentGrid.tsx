import { SimpleGrid, Text, Paper, Group, Stack, Center, Box } from '@mantine/core';
import { IconFileText, IconThumbUp } from '@tabler/icons-react';
import type { Document } from '../types';


interface DocumentGridProps {
  documents: Document[];
}

export function DocumentGrid({ documents }: DocumentGridProps) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
      {documents.map((doc) => (
        <Paper 
            key={doc.id} 
            withBorder 
            p={0} 
            radius="md" 
            style={{ overflow: 'hidden', cursor: 'pointer' }}
            // hover style could be done with css module or sx
        >
            {/* Thumbnail Placeholder */}
            <Box h={140} bg="#f1f5f9" style={{ position: 'relative' }}>
                <Center h="100%">
                    <IconFileText size={40} color="#cbd5e1" />
                </Center>
                <Box 
                    style={{ 
                        position: 'absolute', 
                        bottom: 8, 
                        right: 8,
                        background: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 600
                    }}
                >
                    PDF
                </Box>
            </Box>

            {/* Info */}
            <Stack p="xs" gap={4}>
                <Text size="sm" fw={600} lineClamp={2} c="blue">
                    {doc.title}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={1}>
                    {doc.subject}
                </Text>
                <Group gap={4} mt={4}>
                    <IconThumbUp size={12} color="green" />
                    <Text size="xs" c="green" fw={500}>{doc.likes}</Text>
                </Group>
            </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
