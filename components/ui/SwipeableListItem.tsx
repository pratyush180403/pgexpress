```typescript
import React from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Archive, Star, Trash2, Edit } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';

interface SwipeableListItemProps {
  children: React.ReactNode;
  onArchive?: () => void;
  onFavorite?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function SwipeableListItem({
  children,
  onArchive,
  onFavorite,
  onDelete,
  onEdit,
}: SwipeableListItemProps) {
  const { colors } = useTheme();

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.leftActions}>
        {onArchive && (
          <Animated.View style={[styles.action, { transform: [{ scale }] }]}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={onArchive}
            >
              <Archive size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Archive</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {onFavorite && (
          <Animated.View style={[styles.action, { transform: [{ scale }] }]}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.warning }]}
              onPress={onFavorite}
            >
              <Star size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Favorite</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        {onEdit && (
          <Animated.View style={[styles.action, { transform: [{ scale }] }]}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={onEdit}
            >
              <Edit size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {onDelete && (
          <Animated.View style={[styles.action, { transform: [{ scale }] }]}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={onDelete}
            >
              <Trash2 size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        friction={2}
        leftThreshold={80}
        rightThreshold={80}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  leftActions: {
    flexDirection: 'row',
  },
  rightActions: {
    flexDirection: 'row',
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
});
```