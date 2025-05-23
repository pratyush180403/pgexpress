import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';

interface BulkOperationsProps<T> {
  items: T[];
  onBulkAction: (action: string, items: T[]) => Promise<void>;
  actions: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'danger' | 'success';
  }[];
  renderItem: (item: T, isSelected: boolean, onToggle: () => void) => React.ReactNode;
}

export default function BulkOperations<T extends { id: string }>({
  items,
  onBulkAction,
  actions,
  renderItem,
}: BulkOperationsProps<T>) {
  const { colors } = useTheme();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleAction = async (actionId: string) => {
    try {
      setIsLoading(true);
      const selectedItemsList = items.filter(item => selectedItems.has(item.id));
      await onBulkAction(actionId, selectedItemsList);
      setSelectedItems(new Set());
    } catch (err) {
      console.error('Bulk action failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.selection}>
          <Checkbox
            checked={selectedItems.size === items.length}
            indeterminate={selectedItems.size > 0 && selectedItems.size < items.length}
            onPress={toggleAll}
          />
          <Text style={[styles.selectionText, { color: colors.text }]}>
            {selectedItems.size} selected
          </Text>
        </View>

        <View style={styles.actions}>
          {actions.map(action => (
            <Button
              key={action.id}
              title={action.label}
              variant={action.variant}
              leftIcon={action.icon}
              onPress={() => handleAction(action.id)}
              disabled={selectedItems.size === 0 || isLoading}
              style={styles.actionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {items.map(item => (
          <View key={item.id}>
            {renderItem(
              item,
              selectedItems.has(item.id),
              () => toggleItem(item.id)
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  selection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 100,
  },
  list: {
    flex: 1,
  },
});