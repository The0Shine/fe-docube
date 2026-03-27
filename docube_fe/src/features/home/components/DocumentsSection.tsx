import {
  Container,
  Title,
  Text,
  Tabs,
  Stack,
  Group,
  Button,
  Badge,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export function DocumentsSection() {
  const { t } = useTranslation();

  const documents = [
    "Lecture Notes",
    "Study Guides",
    "Past Exams",
    "Research Papers",
    "Problem Sets",
  ];

  return (
    <Container size="xl" py={80}>
      <Stack gap="lg" align="center" mb={60}>
        <Title order={2} size={40} fw={700}>
          {t("documents.title")}
        </Title>
        <Text size="lg" c="dimmed" maw={600} ta="center">
          {t("documents.subtitle")}
        </Text>
      </Stack>

      <Tabs defaultValue="universities" mb={40}>
        <Tabs.List>
          <Tabs.Tab value="universities">
            {t("documents.universities")}
          </Tabs.Tab>
          <Tabs.Tab value="documents">{t("documents.types")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="documents" pt="xl">
          <Group gap="md" justify="center" mb={30}>
            {documents.map((doc) => (
              <Badge key={doc} size="lg" variant="outline">
                {doc}
              </Badge>
            ))}
          </Group>
        </Tabs.Panel>
      </Tabs>

      <Group justify="center">
        <Button rightSection={<IconArrowRight size={18} />}>
          {t("documents.see_all")}
        </Button>
      </Group>
    </Container>
  );
}
