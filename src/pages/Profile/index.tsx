import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, Avatar } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  password_confirm: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { navigate } = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSaveProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirm: Yup.string()
            .when('oldPassword', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, oldPassword, password, password_confirm } = data;

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                password,
                password_confirm,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);
        updateUser(response.data);

        Alert.alert(
          'Perfil atualizado com sucesso!',
          'As informações do perfil foram atualizadas.',
        );
        navigate('DashBoard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer cadastro, tente novamente.',
        );
      }
    },
    [updateUser],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Avatar source={{ uri: user.avatar_url }} />

            <View>
              <Title>Atualizar perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleSaveProfile}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                containerStyle={{ marginTop: 16 }}
                ref={passwordInputRef}
                secureTextEntry
                name="oldPassword"
                icon="lock"
                placeholder="Senha atual"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => newPasswordInputRef.current?.focus()}
              />

              <Input
                ref={newPasswordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="password_confirm"
                icon="lock"
                placeholder="Confirmar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
