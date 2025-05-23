import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Upload, Check, CircleAlert as AlertCircle, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import Button from '@/components/ui/Button';

type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'not_uploaded';
type DocumentType = 'id_proof' | 'address_proof' | 'police_verification';

interface Document {
  type: DocumentType;
  title: string;
  description: string;
  status: DocumentStatus;
  error?: string;
}

export default function VerificationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const [documents, setDocuments] = useState<Document[]>([
    {
      type: 'id_proof',
      title: 'ID Proof',
      description: 'Upload a valid government ID (Passport, Driver\'s License, etc.)',
      status: 'not_uploaded',
    },
    {
      type: 'address_proof',
      title: 'Address Proof',
      description: 'Upload a recent utility bill or bank statement',
      status: 'not_uploaded',
    },
    {
      type: 'police_verification',
      title: 'Police Verification',
      description: 'Upload police verification certificate',
      status: 'not_uploaded',
    },
  ]);

  const pickDocument = async (type: DocumentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Validate file size (5MB limit)
        if (file.size && file.size > 5 * 1024 * 1024) {
          setDocuments(docs => 
            docs.map(doc => 
              doc.type === type
                ? { ...doc, status: 'rejected', error: 'File size must be less than 5MB' }
                : doc
            )
          );
          return;
        }

        // TODO: Upload to Supabase storage
        console.log('Document selected:', file);

        // Update document status
        setDocuments(docs =>
          docs.map(doc =>
            doc.type === type
              ? { ...doc, status: 'pending', error: undefined }
              : doc
          )
        );
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setDocuments(docs =>
        docs.map(doc =>
          doc.type === type
            ? { ...doc, status: 'rejected', error: 'Failed to upload document' }
            : doc
        )
      );
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <Check size={20} color={colors.success} />;
      case 'rejected':
        return <X size={20} color={colors.error} />;
      case 'pending':
        return <AlertCircle size={20} color={colors.warning} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Verification</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Upload your documents for verification
        </Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          Document Requirements
        </Text>
        <View style={styles.infoList}>
          <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
            • Supported formats: PDF, JPG, PNG
          </Text>
          <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
            • Maximum file size: 5MB
          </Text>
          <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
            • Documents must be clear and readable
          </Text>
          <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
            • All pages must be included in a single file
          </Text>
        </View>
      </View>

      {documents.map((document, index) => (
        <View 
          key={document.type}
          style={[styles.documentCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.documentHeader}>
            <View>
              <Text style={[styles.documentTitle, { color: colors.text }]}>
                {document.title}
              </Text>
              <Text style={[styles.documentDescription, { color: colors.textSecondary }]}>
                {document.description}
              </Text>
            </View>
            {getStatusIcon(document.status)}
          </View>

          {document.error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {document.error}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.uploadButton,
              { borderColor: getStatusColor(document.status) }
            ]}
            onPress={() => pickDocument(document.type)}
          >
            <Upload size={24} color={getStatusColor(document.status)} />
            <Text style={[styles.uploadText, { color: getStatusColor(document.status) }]}>
              {document.status === 'not_uploaded'
                ? 'Upload Document'
                : 'Replace Document'}
            </Text>
          </TouchableOpacity>
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
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    marginTop: 8,
  },
});