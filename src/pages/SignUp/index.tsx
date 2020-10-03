import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Container, Title, BackButton, BackButtonText } from './styles';
import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu Logon</Title>
            </View>
            <Input name="name" placeholder="Nome" icon="user" />
            <Input name="email" placeholder="E-mail" icon="mail" />
            <Input name="password" placeholder="Senha" icon="lock" />

            <Button
              onPress={() => {
                console.log('Button');
              }}
            >
              Cadastrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#f4ede8" />
        <BackButtonText>Voltar para o login</BackButtonText>
      </BackButton>
    </>
  );
};

export default SignUp;
