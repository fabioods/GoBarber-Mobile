import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

interface InputProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.View<InputProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  border-width: 2px;
  border-color: #232129;

  ${props =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #ffffff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const InputIcon = styled(Icon)`
  margin-right: 8px;
`;
