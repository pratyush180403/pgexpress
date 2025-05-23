import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showHistory?: boolean;
  maxHistory?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
  showHistory = true,
  maxHistory = 5,
}: SearchBarProps) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const animatedHeight = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showResults ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showResults]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    onSearch(searchQuery);
    if (showHistory) {
      setHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(h => h !== searchQuery)];
        return newHistory.slice(0, maxHistory);
      });
    }
    setShowResults(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const historyHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(history.length * 44, 220)],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={text => {
            setQuery(text);
            setShowResults(!!text && showHistory);
          }}
          onSubmitEditing={() => handleSearch(query)}
          returnKeyType="search"
        />
        {query ? (
          <TouchableOpacity onPress={clearSearch}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {showHistory && (
        <Animated.View
          style={[
            styles.historyContainer,
            {
              backgroundColor: colors.surface,
              height: historyHeight,
            },
          ]}
        >
          {history.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.historyItem,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => {
                setQuery(item);
                handleSearch(item);
              }}
            >
              <Search size={16} color={colors.textSecondary} />
              <Text style={[styles.historyText, { color: colors.text }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  historyContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});