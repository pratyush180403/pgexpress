```typescript
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Shield, AlertCircle, CheckCircle, XCircle, HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';

type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface VerificationStatusProps {
  type: string;
  status: VerificationStatus;
  message?: string;
  onAction?: () => void;
}

export default function VerificationStatus({
  type,
  status,
  message,
  onAction,
}: VerificationStatusProps) {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return colors.success;
      case 'rejected':
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={24} color={colors.success} />;
      case 'rejected':
        return <XCircle size={24} color={colors.error} />;
      default:
        return <AlertCircle size={24} color={colors.warning} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Shield size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{type}</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.helpButton, { backgroundColor: colors.primary + '10' }]}
        >
          <HelpCircle size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.statusContainer,
        { backgroundColor: getStatusColor() + '10' }
      ]}>
        {getStatusIcon()}
        <View style={styles.statusContent}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
          {message && (
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>
          )}
        </View>
      </View>

      {onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onAction}
        >
          <Text style={styles.actionText}>Take Action</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actionButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});
```