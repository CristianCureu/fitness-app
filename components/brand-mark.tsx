import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { cn } from '@/lib/utils';

type BrandMarkProps = {
  label?: string;
  size?: number;
  className?: string;
};

/**
 * Small reusable brand mark with a pink → purple gradient and a fallback background.
 * Keeps sizing consistent across auth screens.
 */
export function BrandMark({ label = 'F', size = 64, className }: BrandMarkProps) {
  const radius = size / 4;

  return (
    <LinearGradient
      colors={['#f798af', '#9A8CFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: radius }}
      className={cn('items-center justify-center shadow-md shadow-primary/30', className)}
    >
      <Text
        className="text-white font-black"
        style={{ fontSize: size / 2 }}
      >
        {label}
      </Text>
    </LinearGradient>
  );
}

export default BrandMark;
