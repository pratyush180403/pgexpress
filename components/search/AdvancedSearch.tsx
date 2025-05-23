import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Filter, Search as SearchIcon, X } from 'lucide-react-native';

interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string | number | [number, number];
}

interface AdvancedSearchProps {
  fields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: { label: string; value: string }[];
  }[];
  onSearch: (filters: SearchFilter[]) => void;
}

export default function AdvancedSearch({ fields, onSearch }: AdvancedSearchProps) {
  const { colors } = useTheme();
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const addFilter = () => {
    setFilters(prev => [
      ...prev,
      { field: fields[0].id, operator: 'equals', value: '' },
    ]);
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    setFilters(prev =>
      prev.map((filter, i) =>
        i === index ? { ...filter, ...updates } : filter
      )
    );
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters([]);
    onSearch([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Input
          placeholder="Search..."
          leftIcon={<SearchIcon size={20} color={colors.textSecondary} />}
          onSubmitEditing={handleSearch}
        />
        
        <Button
          variant="outline"
          leftIcon={<Filter size={20} color={colors.primary} />}
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        />
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {filters.map((filter, index) => (
            <View key={index} style={styles.filterRow}>
              <View style={styles.filterFields}>
                <Select
                  value={filter.field}
                  options={fields.map(f => ({ label: f.label, value: f.id }))}
                  onChange={value => updateFilter(index, { field: value })}
                  style={styles.fieldSelect}
                />
                
                <Select
                  value={filter.operator}
                  options={[
                    { label: 'Equals', value: 'equals' },
                    { label: 'Contains', value: 'contains' },
                    { label: 'Greater than', value: 'greater' },
                    { label: 'Less than', value: 'less' },
                    { label: 'Between', value: 'between' },
                  ]}
                  onChange={value => updateFilter(index, { operator: value })}
                  style={styles.operatorSelect}
                />
                
                <Input
                  value={String(filter.value)}
                  onChangeText={value => updateFilter(index, { value })}
                  style={styles.valueInput}
                />
              </View>

              <TouchableOpacity
                onPress={() => removeFilter(index)}
                style={styles.removeButton}
              >
                <X size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.filterActions}>
            <Button
              title="Add Filter"
              variant="outline"
              onPress={addFilter}
              style={styles.actionButton}
            />
            <Button
              title="Clear All"
              variant="outline"
              onPress={clearFilters}
              style={styles.actionButton}
            />
            <Button
              title="Search"
              onPress={handleSearch}
              style={styles.actionButton}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  filterButton: {
    width: 44,
  },
  filtersContainer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterFields: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  fieldSelect: {
    flex: 2,
  },
  operatorSelect: {
    flex: 2,
  },
  valueInput: {
    flex: 3,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    minWidth: 100,
  },
});