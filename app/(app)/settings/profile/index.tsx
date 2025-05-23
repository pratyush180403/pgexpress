import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Mail, Phone, ChevronRight, Shield, CreditCard } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, updateUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle image upload to Supabase storage
      try {
        // TODO: Implement image upload
        console.log('Image selected:', result.assets[0].uri);
      } catch (err) {
        setError('Failed to update profile photo');
      }
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement profile update
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const getVerificationStatus = () => {
    if (user?.verified) {
      return {
        label: 'Verified',
        color: colors.success,
      };
    }
    if (user?.kyc_status === 'pending') {
      return {
        label: 'Pending Verification',
        color: colors.warning,
      };
    }
    return {
      label: 'Unverified',
      color: colors.error,
    };
  };

  const status = getVerificationStatus();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={styles.photoContainer}>
          <View style={[styles.photoWrapper, { backgroundColor: colors.primary + '20' }]}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.photo}
              />
            ) : (
              <Text style={[styles.photoPlaceholder, { color: colors.primary }]}>
                {user?.name?.[0]?.toUpperCase()}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.photoButton, { backgroundColor: colors.primary }]}
            onPress={pickImage}
          >
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={[styles.verificationBadge, { backgroundColor: status.color + '20' }]}>
          <Text style={[styles.verificationText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Name"
            value={formData.name}
            onChangeText={value => setFormData(prev => ({ ...prev, name: value }))}
            editable={isEditing}
            containerStyle={styles.input}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={value => setFormData(prev => ({ ...prev, email: value }))}
            editable={isEditing}
            keyboardType="email-address"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
            containerStyle={styles.input}
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChangeText={value => setFormData(prev => ({ ...prev, phone: value }))}
            editable={isEditing}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
            containerStyle={styles.input}
          />

          {isEditing ? (
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setIsEditing(false)}
                style={styles.button}
              />
              <Button
                title="Save"
                onPress={handleSave}
                style={styles.button}
              />
            </View>
          ) : (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            />
          )}
        </View>
      </View>

      <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/settings/verification')}
        >
          <View style={styles.menuItemLeft}>
            <Shield size={20} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              Verification Status
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={() => router.push('/settings/payment-methods')}
        >
          <View style={styles.menuItemLeft}>
            <CreditCard size={20} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              Payment Methods
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
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
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  photoPlaceholder: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
  },
  photoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBadge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  verificationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  editButton: {
    marginTop: 8,
  },
  menuSection: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});