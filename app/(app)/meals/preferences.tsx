import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { useMeal } from '@/components/MealContext';
import { useTheme } from '@/components/ThemeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Halal',
  'Kosher',
];

export default function PreferencesScreen() {
  const { colors } = useTheme();
  const { preferences, updatePreferences, isLoading } = useMeal();
  const [newAllergy, setNewAllergy] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleRestriction = (restriction: string) => {
    const current = preferences?.dietaryRestrictions || [];
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];

    handleUpdate({ dietaryRestrictions: updated });
  };

  const addAllergy = () => {
    if (!newAllergy.trim()) return;

    const current = preferences?.allergies || [];
    handleUpdate({ allergies: [...current, newAllergy.trim()] });
    setNewAllergy('');
  };

  const removeAllergy = (allergy: string) => {
    const current = preferences?.allergies || [];
    handleUpdate({ allergies: current.filter(a => a !== allergy) });
  };

  const handleUpdate = async (updates: Partial<typeof preferences>) => {
    try {
      setError(null);
      await updatePreferences(updates);
    } catch (err) {
      setError('Failed to update preferences');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Dietary Preferences</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your meal preferences and allergies
        </Text>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Dietary Restrictions
        </Text>
        <View style={styles.restrictionsGrid}>
          {DIETARY_RESTRICTIONS.map(restriction => (
            <TouchableOpacity
              key={restriction}
              style={[
                styles.restrictionChip,
                {
                  backgroundColor: preferences?.dietaryRestrictions?.includes(restriction)
                    ? colors.primary
                    : colors.surface,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => toggleRestriction(restriction)}
            >
              <Text
                style={[
                  styles.restrictionText,
                  {
                    color: preferences?.dietaryRestrictions?.includes(restriction)
                      ? '#FFFFFF'
                      : colors.primary,
                  },
                ]}
              >
                {restriction}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Allergies
        </Text>
        
        <View style={styles.allergyInput}>
          <Input
            placeholder="Add allergy..."
            value={newAllergy}
            onChangeText={setNewAllergy}
            containerStyle={styles.input}
          />
          <Button
            title="Add"
            onPress={addAllergy}
            leftIcon={<Plus size={20} color="#FFFFFF" />}
            style={styles.addButton}
          />
        </View>

        <View style={styles.allergiesList}>
          {preferences?.allergies?.map(allergy => (
            <View
              key={allergy}
              style={[styles.allergyChip, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.allergyText, { color: colors.text }]}>
                {allergy}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAllergy(allergy)}
              >
                <X size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    paddingTop: 44,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  restrictionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  restrictionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  restrictionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  allergyInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    minWidth: 100,
  },
  allergiesList: {
    gap: 8,
  },
  allergyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  allergyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  removeButton: {
    padding: 4,
  },
});