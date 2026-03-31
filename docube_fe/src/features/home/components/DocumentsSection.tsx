import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { documentApi } from "@/shared/services";
import { DocumentCard } from "@/shared/ui";
import { useAuthStore } from "@/stores";
import type { DocumentSummaryResponse } from "@/shared/types";

export function DocumentsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [documents, setDocuments] = useState<DocumentSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentApi
      .getAll({ page: 0, size: 8, sort: "createdAt,desc" })
      .then((res) => setDocuments(res.content))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={200} radius="md" />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
          {documents.map((doc) => (
            <div key={doc.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${doc.id}`)}>
              <DocumentCard
                document={doc}
                isBookmarked={false}
                showBookmark={isAuthenticated}
              />
            </div>
          ))}
        </SimpleGrid>
      )}

      <Group justify="center" mt={48}>
        <Button
          rightSection={<IconArrowRight size={18} />}
          onClick={() => navigate("/documents")}
        >
          {t("documents.see_all")}
        </Button>
      </Group>
    </Container>
  );
}
