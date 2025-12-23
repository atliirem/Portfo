import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {  useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { signUpThunk } from '../../../api';
import type { RootState, AppDispatch } from '../../redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [invitation_code, setInvitation_code] = useState('');
  

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password || !name || !invitation_code) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await dispatch(signUpThunk({ email, password , name, invitation_code})).unwrap();
      navigation.navigate('Profile');
    } catch (err: any) {
      Alert.alert('Giriş Başarısız', err?.message || 'Hata oluştu');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome  </Text>
          <Text style={styles.subtitle}>Sign up </Text>

          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#999"
            />
             <TextInput
              placeholder="Name"
              value={name}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#999"
            />
             <TextInput
              placeholder="Invitation Code"
              value={invitation_code}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setInvitation_code}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {error && <Text style={styles.error}>{String(error)}</Text>}

          <View style={styles.footer}>
            
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}> Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginBottom: 40,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 18,
    color: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  error: {
    marginTop: 16,
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 15,
  },
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#444',
  },
  footerLink: {
    fontSize: 16,
    color: '#6a1b9a',
    fontWeight: '600',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
});