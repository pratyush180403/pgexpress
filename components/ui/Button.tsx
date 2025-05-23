import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = isLoading || disabled;

  // Define colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return ['#0A6CFF', '#0A54FF'];
      case 'secondary':
        return ['#08B2B2', '#07A0A0'];
      case 'danger':
        return ['#FF3B30', '#E02A20'];
      case 'success':
        return ['#34C759', '#27AE60'];
      default:
        return undefined;
    }
  };

  // Get container styles based on variant and size
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      opacity: isDisabled ? 0.6 : 1,
      width: fullWidth ? '100%' : undefined,
    };

    // Add size-specific styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      sm: { height: 36, paddingHorizontal: 16 },
      md: { height: 44, paddingHorizontal: 20 },
      lg: { height: 52, paddingHorizontal: 24 },
    };

    // Add variant-specific styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {},
      secondary: {},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0A6CFF',
      },
      danger: {},
      success: {},
      text: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...styles.container,
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  // Get text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const variantStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: '#0A6CFF' },
      danger: { color: '#FFFFFF' },
      success: { color: '#FFFFFF' },
      text: { color: '#0A6CFF' },
    };

    return {
      ...styles.text,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  const renderContent = () => (
    <>
      {isLoading ? (
        <ActivityIndicator
          testID="loading-indicator"
          color={variant === 'outline' || variant === 'text' ? '#0A6CFF' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyles()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </>
  );

  // For variants that use gradient backgrounds
  if (['primary', 'secondary', 'danger', 'success'].includes(variant) && !isDisabled) {
    return (
      <TouchableOpacity
        style={getContainerStyles()}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...rest}
      >
        <LinearGradient
          colors={getColors() || ['#0A6CFF', '#0A54FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // For outline and text variants
  return (
    <TouchableOpacity
      style={getContainerStyles()}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  gradient: {
    borderRadius: 8,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
});