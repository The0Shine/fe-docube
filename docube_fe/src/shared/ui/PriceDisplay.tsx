import { Badge, Text } from '@mantine/core';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  fw?: number;
}

export function PriceDisplay({ price, size = 'sm', fw = 700 }: PriceDisplayProps) {
  if (price === 0) {
    return (
      <Badge color="green" variant="light" size={size}>
        Miễn phí
      </Badge>
    );
  }
  return (
    <Text size={size} fw={fw} c="primary">
      {price.toLocaleString('vi-VN')}đ
    </Text>
  );
}
