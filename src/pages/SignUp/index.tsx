import React, { useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, Title, BackButton, BackButtonText } from './styles';
import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErros from '../../utils/getValidationErrors';
import api from '../../services/api';

interface FormProps {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleOnSubmit = useCallback(
    async (data: FormProps) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().min(3, 'Pelo menos 3 letras.'),
          email: Yup.string()
            .required('Digite um e-mail.')
            .email('Digite um e-mail válido.'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos.'),
        });
        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);
        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação',
        );
        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro na autenticação',
          'Falha ao realizar o cadastro, tente novamente',
        );
      }
    },
    [navigation],
  );

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
            <Form onSubmit={handleOnSubmit} ref={formRef}>
              <Input
                autoCapitalize="words"
                name="name"
                placeholder="Nome"
                icon="user"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <Input
                ref={emailRef}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                name="email"
                placeholder="E-mail"
                icon="mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
              <Input
                ref={passwordRef}
                textContentType="newPassword"
                secureTextEntry
                name="password"
                placeholder="Senha"
                icon="lock"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Cadastrar
              </Button>
            </Form>
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
