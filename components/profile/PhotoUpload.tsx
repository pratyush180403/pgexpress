```typescript
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Camera, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export default function PhotoUpload({
  currentPhotoUrl,
  onUpload,
  isLoading,
}: PhotoUploadProps) {
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImagePick = async () => {
    try {
      setError(null);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      });

      if (!result.canceled && result.assets[0]) {
        setPreview(result.assets[0].uri);
        
        // Convert to File object for upload
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
        
        await onUpload(file);
      }
    } catch (err) {
      setError('Failed to upload photo');
      console.error('Photo upload error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.photoContainer, { backgroundColor: colors.surface }]}>
        {(currentPhotoUrl || preview) ? (
          <Image
            source={{ uri: preview || currentPhotoUrl }}
            style={styles.photo}
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.primary + '20' }]}>
            <Camera size={48} color={colors.primary} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          onPress={handleImagePick}
          disabled={isLoading}
        >
          <Upload size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {preview && (
        <View style={styles.previewActions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setPreview(null)}
            style={styles.actionButton}
          />
          <Button
            title="Save"
            onPress={() => {}}
            isLoading={isLoading}
            style={styles.actionButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    minWidth: 100,
  },
});
```