/**
 * NProgress Helpers - Tiện ích navigation progress
 * Sử dụng @mantine/nprogress
 */
import { nprogress } from '@mantine/nprogress';

/**
 * Bắt đầu progress bar
 */
export const startProgress = () => {
  nprogress.start();
};

/**
 * Kết thúc progress bar
 */
export const completeProgress = () => {
  nprogress.complete();
};

/**
 * Set progress value (0-100)
 */
export const setProgress = (value: number) => {
  nprogress.set(value);
};

/**
 * Tăng progress một chút
 */
export const incrementProgress = () => {
  nprogress.increment();
};

/**
 * Reset progress
 */
export const resetProgress = () => {
  nprogress.reset();
};
