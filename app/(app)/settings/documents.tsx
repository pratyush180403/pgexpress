import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Upload, Check, X, CircleAlert as AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

interface Document {
  id: string;
  type: 'id_proof' | 'address_proof' | 'police_verification';
  status: 'pending' | 'approved' | 'rejected';
  url?: string;
}

export default function DocumentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', type: 'id_proof', status: 'pending' },
    { id: '2', type: 'address_proof', status: 'pending' },
    { id: '3', type: 'police_verification', status: 'pending' }
  ]);

  const pickImage = async (documentId: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Update document with image
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === documentId 
            ? { ...doc, url: result.assets[0].uri }
            : doc
        )
      );
    }
  };

  const getDocumentTitle = (type: Document['type']) => {
    switch (type) {
      case 'id_proof':
        return 'ID Proof';
      case 'address_proof':
        return 'Address Proof';
      case 'police_verification':
        return 'Police Verification';
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <Check size={16} color={colors.success} />;
      case 'rejected':
        return <X size={16} color={colors.error} />;
      default:
        return <AlertCircle size={16} color={colors.warning} />;
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Documents</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Upload your documents for verification
        </Text>
      </View>

      {documents.map(document => (
        <View 
          key={document.id}
          style={[styles.documentCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.documentHeader}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              {getDocumentTitle(document.type)}
            </Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(document.status) + '20' }
            ]}>
              {getStatusIcon(document.status)}
              <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </Text>
            </View>
          </View>

          {document.url ? (
            <Image
              source={{ uri: document.url }}
              style={styles.documentImage}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity
              style={[styles.uploadContainer, { borderColor: colors.border }]}
              onPress={() => pickImage(document.id)}
            >
              <Upload size={24} color={colors.primary} />
              <Text style={[styles.uploadText, { color: colors.primary }]}>
                Upload Document
              </Text>
            </TouchableOpacity>
          )}

          {document.url && (
            <Button
              title="Change Document"
              variant="outline"
              onPress={() => pickImage(document.id)}
              style={styles.changeButton}
            />
          )}
        </View>
      ))}

      <Button
        title="Submit for Verification"
        onPress={() => {}}
        style={styles.submitButton}
      />
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
    fontFamily: 'Roboto-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  documentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  uploadContainer: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  changeButton: {
    marginTop: 12,
  },
  submitButton: {
    marginTop: 8,
  },
});