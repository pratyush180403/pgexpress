import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthContext } from '@/components/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, error: authError, isLoading } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Simple validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setError(null);
    
    try {
      await signIn(email, password);
    } catch (err) {
      // Error handling is already in the auth hook
    }
  };

  // Demo account quick logins
  const loginAsTenant = () => {
    setEmail('tenant@example.com');
    setPassword('password123');
  };

  const loginAsManager = () => {
    setEmail('manager@example.com');
    setPassword('password123');
  };

  const loginAsAdmin = () => {
    setEmail('admin@example.com');
    setPassword('password123');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg' }}
              style={styles.logoBackground}
            />
            <View style={styles.overlay} />
            <Text style={styles.logoText}>PropertyPro</Text>
            <Text style={styles.tagline}>Tenant Management Made Easy</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
            
            {(error || authError) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || authError}</Text>
              </View>
            )}
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color="#A0A0A0" />}
              containerStyle={styles.inputContainer}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword={true}
              leftIcon={<Lock size={20} color="#A0A0A0" />}
              containerStyle={styles.inputContainer}
            />
            
            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
              fullWidth
            />
            
            <Text style={styles.dividerText}>Quick Demo Logins</Text>
            
            <View style={styles.demoButtons}>
              <Button
                title="Tenant"
                variant="outline"
                onPress={loginAsTenant}
                style={styles.demoButton}
              />
              
              <Button
                title="Manager"
                variant="outline"
                onPress={loginAsManager}
                style={styles.demoButton}
              />
              
              <Button
                title="Admin"
                variant="outline"
                onPress={loginAsAdmin}
                style={styles.demoButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 108, 255, 0.8)',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  dividerText: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});