import { Badge } from '@mantine/core';
import { IconFileTypePdf, IconFileTypeDocx, IconFileText } from '@tabler/icons-react';
import type { FileType } from '@/shared/types';

interface FileTypeBadgeProps {
  fileType: FileType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const FILE_TYPE_CONFIG: Record<FileType, { color: string; label: string; Icon: React.ElementType }> = {
  PDF:  { color: 'red',  label: 'PDF',  Icon: IconFileTypePdf },
  WORD: { color: 'blue', label: 'Word', Icon: IconFileTypeDocx },
  TEXT: { color: 'gray', label: 'Text', Icon: IconFileText },
};

export function FileTypeBadge({ fileType, size = 'sm' }: FileTypeBadgeProps) {
  const { color, label, Icon } = FILE_TYPE_CONFIG[fileType] ?? FILE_TYPE_CONFIG.PDF;
  return (
    <Badge
      color={color}
      variant="light"
      size={size}
      leftSection={<Icon size={12} />}
    >
      {label}
    </Badge>
  );
}
