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
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginThunk } from '../../../api';
import Logo from '../../components/Logo';
import type { RootState, AppDispatch } from '../../redux/store';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootStack';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('admin@pigasoft.com');
  const [password, setPassword] = useState('12345678');

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await dispatch(loginThunk({ email, password })).unwrap();

      
      navigation.navigate('App');
    } catch (err: any) {
      Alert.alert('Giriş Başarısız', err?.message || 'Bir hata oluştu');
    }
  };

  const handlePress = () => {
    Linking.openURL('https://port-foy.com/tr/registration/application');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <Logo />

          <Text style={styles.subtitle}>Giriş Yap</Text>
          <Text style={styles.text1}>Devam etmek için lütfen giriş yapın.</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="E-posta"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Şifre"
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
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>

          {error && <Text style={styles.error}>{String(error)}</Text>}

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('VerifyCode' as never)}>
              <Text style={styles.footerLink}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            <Text style={styles.text}>
              Henüz hesabınız yoksa hemen firma başvurusu yapabilirsiniz.
            </Text>

            <TouchableOpacity onPress={handlePress} style={styles.buttonSmall}>
              <Text style={styles.buttonText2}>Yeni Firma Başvurusu</Text>
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
    color: '#E8CC84',
    fontSize: 16,
    marginBottom: 30, 
    marginTop: -55,
    fontWeight:'700'
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 4,
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
    backgroundColor: '#25C5D1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
   justifyContent: 'center', 
   marginTop: 0,
  },
  buttonSmall:{
     backgroundColor: '#C4C4C4',
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 6,
    width: 155

  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    
  },
   buttonText2: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
    justifyContent: 'center',
    textAlign: 'center'
    
  },
  
  error: {
    marginTop: 16,
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 15,
  },
  footer: {
    marginTop: 40,
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#444',
  },
  footerLink: {
    fontSize: 16,
    color: '#25C5D1',
    fontWeight: '600',
    marginLeft: 195,
 
  },
  text:{
    justifyContent: 'center',
    fontSize: 13,
    color: '#999999ff',
    textAlign: 'center',
    margin: 20,


  },
   text1:{
    justifyContent: 'center',
    fontSize: 14,
    color: '#999999ff',
    textAlign: 'center',
   margin: 20,
   marginTop: -10


  }
});