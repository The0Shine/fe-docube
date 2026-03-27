import {
  Container,
  Title,
  Text,
  Group,
  TextInput,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "./Hero.module.css";

export function Hero() {
  const { t } = useTranslation();

  return (
    <div className={classes.hero}>
      <Container size="lg" py={{ base: 80, md: 120 }}>
        <Stack gap="xl" align="center">
          <Title
            order={1}
            size={48}
            ta="center"
            fw={800}
            className={classes.title}
          >
            {t("hero.title")}
          </Title>
          <Text size="xl" ta="center" c="dimmed" maw={600}>
            {t("hero.subtitle")}
          </Text>

          <Group justify="center" w="100%">
            <TextInput
              placeholder={t("hero.search_placeholder")}
              size="lg"
              radius="xl"
              w={{ base: "100%", sm: 520 }}
              rightSectionWidth={56}
              rightSection={
                <ActionIcon size={44} radius="xl" variant="filled">
                  <IconSearch size={20} />
                </ActionIcon>
              }
              rightSectionPointerEvents="all"
            />
          </Group>

          <div className={classes.blobContainer}>
            <svg
              className={classes.blob1}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#e3f2fd"
                d="M50,50 Q100,0 150,50 T150,150 Q100,200 50,150 T50,50"
              />
            </svg>
            <svg
              className={classes.blob2}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#f3e5f5"
                d="M40,60 Q80,20 140,40 T160,140 Q100,180 40,160 T40,60"
              />
            </svg>
            <svg
              className={classes.blob3}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#e0f2f1"
                d="M60,40 Q110,10 160,50 T150,160 Q90,190 50,150 T60,40"
              />
            </svg>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
