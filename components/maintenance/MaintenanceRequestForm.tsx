import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { MaintenancePriority } from '@/hooks/useMaintenanceRequests';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface MaintenanceRequestFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    priority: MaintenancePriority;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function MaintenanceRequestForm({
  onSubmit,
  isLoading,
}: MaintenanceRequestFormProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as MaintenancePriority,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);

      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Title"
        value={formData.title}
        onChangeText={(value) => setFormData(prev => ({ ...prev, title: value }))}
        placeholder="Enter request title"
      />

      <Input
        label="Description"
        value={formData.description}
        onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
        placeholder="Describe the issue"
        multiline
        numberOfLines={4}
      />

      <View style={styles.prioritySection}>
        <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
        <View style={styles.priorityButtons}>
          {(['low', 'medium', 'high', 'urgent'] as MaintenancePriority[]).map(priority => (
            <Button
              key={priority}
              title={priority.charAt(0).toUpperCase() + priority.slice(1)}
              variant={formData.priority === priority ? 'primary' : 'outline'}
              onPress={() => setFormData(prev => ({ ...prev, priority }))}
              style={styles.priorityButton}
            />
          ))}
        </View>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <Button
        title="Submit Request"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  prioritySection: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    marginTop: 8,
  },
});