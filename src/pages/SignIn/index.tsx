import React from 'react';
import { Image } from 'react-native';

import { Container, Title } from './styles';
import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignIn: React.FC = () => {
  return (
    <Container>
      <Image source={logoImg} />
      <Title>Faça seu Logon</Title>
      <Input name="email" placeholder="E-mail" icon="mail" />
      <Input name="password" placeholder="Password" icon="lock" />

      <Button
        onPress={() => {
          console.log('Button');
        }}
      >
        Entrar
      </Button>
    </Container>
  );
};

export default SignIn;
