import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import ptBR from 'date-fns/locale/pt-BR';
import {
  Container,
  Description,
  Title,
  OkButton,
  OkButtonText,
} from './styles';

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const handleOkButton = useCallback(() => {
    reset({ routes: [{ name: 'DashBoard' }], index: 0 });
  }, [reset]);
  const route = useRoute();
  const { date } = route.params as { date: Date };

  const formattedDate = useMemo(() => {
    return format(date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
      locale: ptBR,
    });
  }, [date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>
      <OkButton onPress={handleOkButton}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
