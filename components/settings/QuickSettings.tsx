import React from 'react';
import { StyleSheet, View, Text, Switch, Animated } from 'react-native';
import { useTheme } from '@/components/ThemeContext';

interface QuickSetting {
  id: string;
  title: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

interface QuickSettingsProps {
  settings: QuickSetting[];
}

export default function QuickSettings({ settings }: QuickSettingsProps) {
  const { colors } = useTheme();

  const handleToggle = (setting: QuickSetting, newValue: boolean) => {
    const animation = new Animated.Value(newValue ? 0 : 1);
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: newValue ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setting.onChange(newValue);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {settings.map(setting => (
        <View
          key={setting.id}
          style={[
            styles.settingItem,
            { borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {setting.title}
            </Text>
            {setting.description && (
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {setting.description}
              </Text>
            )}
          </View>
          
          <Switch
            value={setting.value}
            onValueChange={(newValue) => handleToggle(setting, newValue)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});