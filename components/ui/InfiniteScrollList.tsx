```typescript
import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import SkeletonLoader from './SkeletonLoader';

interface InfiniteScrollListProps<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactNode;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  error?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  ListEmptyComponent?: React.ReactNode;
  contentContainerStyle?: any;
}

export default function InfiniteScrollList<T>({
  data,
  renderItem,
  onLoadMore,
  isLoading,
  hasMore,
  error,
  onRefresh,
  isRefreshing,
  ListEmptyComponent,
  contentContainerStyle,
}: InfiniteScrollListProps<T>) {
  const { colors } = useTheme();

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.skeletonItem}>
            <SkeletonLoader height={60} borderRadius={8} />
          </View>
        ))}
      </View>
    );
  };

  if (isLoading && !isRefreshing) {
    return renderLoading();
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.8}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={renderError}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      contentContainerStyle={[
        styles.contentContainer,
        !data.length && styles.emptyContainer,
        contentContainerStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonItem: {
    marginBottom: 12,
  },
});
```