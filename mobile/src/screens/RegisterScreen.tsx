import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { styles } from './AuthStyles';

export const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'ASSEMBLER' | 'MANUFACTURER'>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();

  const roles = [
    { value: 'CUSTOMER', label: 'Müşteri (Hizmet Alacak)' },
    { value: 'ASSEMBLER', label: 'Montajcı (Hizmet Verecek)' },
    { value: 'MANUFACTURER', label: 'Üretici (Ürün Satacak)' },
  ];

  const handleRegister = async () => {
    if (!name || !email || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, role });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Kayıt başarısız';
      Alert.alert('Hata', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder} />
          <Text style={styles.title}>Montajım Var</Text>
          <Text style={styles.subtitle}>Hesap oluşturun</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Adınız ve soyadınız"
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
          />

          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
          />

          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="En az 6 karakter"
            secureTextEntry
            autoCompleteType="new-password"
            textContentType="newPassword"
          />

          <Text style={styles.label}>Şifre Tekrar</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Şifrenizi tekrar girin"
            secureTextEntry
            autoCompleteType="new-password"
            textContentType="newPassword"
          />

          <Text style={styles.label}>Hesap Türü</Text>
          <View style={styles.roleSelector}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[
                  styles.roleOption,
                  role === r.value && styles.roleOptionSelected,
                ]}
                onPress={() => setRole(r.value as typeof role)}
              >
                <Text style={[
                  styles.roleOptionText,
                  role === r.value && styles.roleOptionTextSelected,
                ]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.registerLink}>
          <Text style={styles.registerText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLinkText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;