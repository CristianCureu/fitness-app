import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  iconPosition?: 'left' | 'right';
};

const VARIANT_STYLES: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary border border-primary/30 shadow-sm shadow-primary/20',
    text: 'text-[#0F111A] font-semibold',
  },
  secondary: {
    container: 'bg-purple-dark/70 border border-purple-soft/50',
    text: 'text-text-primary font-semibold',
  },
  outline: {
    container: 'border border-primary/50 bg-transparent',
    text: 'text-primary font-semibold',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-text-secondary font-semibold',
  },
  danger: {
    container: 'border-2 border-red-500/40 bg-red-500/10',
    text: 'text-red-400 font-semibold',
  },
};

const INDICATOR_COLORS: Record<ButtonVariant, string> = {
  primary: '#0F111A',
  secondary: '#E8ECF5',
  outline: '#f798af',
  ghost: '#f798af',
  danger: '#f87171',
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  fullWidth,
  iconName,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { container, text } = VARIANT_STYLES[variant];
  const indicatorColor = INDICATOR_COLORS[variant] ?? '#ffffff';

  return (
    <Pressable
      className={cn(
        'h-14 rounded-2xl px-4 flex-row items-center justify-center gap-2',
        container,
        fullWidth && 'w-full',
        isDisabled && 'opacity-60',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <>
          {iconName && iconPosition === 'left' ? (
            <Ionicons name={iconName} size={16} color={indicatorColor} />
          ) : null}
          <Text className={cn('text-base', text)}>{label}</Text>
          {iconName && iconPosition === 'right' ? (
            <Ionicons name={iconName} size={16} color={indicatorColor} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

export default Button;
