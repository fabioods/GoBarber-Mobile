import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Datetimepicker from '@react-native-community/datetimepicker';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import { Provider } from '../DashBoard';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProviderListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenDayPickerButton,
  OpenDayPickerButtonText,
  Schedule,
  ScheduleTitle,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerID: string;
}

export interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);
  const { providerID } = route.params as RouteParams;
  const [selectedProvider, setSelectedProvider] = useState(providerID);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  const navigateToProfile = useCallback(() => {
    goBack();
  }, [goBack]);

  useEffect(() => {
    api.get<Provider[]>('/providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const handleSelectProvider = useCallback((provider_id: string) => {
    setSelectedProvider(provider_id);
  }, []);

  const handleToggleTimePicker = useCallback(() => {
    setShowDateTimePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDateTimePicker(false);
    }
    if (date) setSelectedDate(date);
  }, []);

  useEffect(() => {
    api
      .get<AvailabilityItem[]>(
        `/providers/${selectedProvider}/day-availability`,
        {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        },
      )
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(item => item.hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(item => item.hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setMinutes(0);
      date.setUTCHours(selectedHour + 3);

      await api.post('appointments', { provider_id: selectedProvider, date });
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao criar agendamento, tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToProfile}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProviderListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={provider => provider.id}
            data={providers}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>

        <Calendar>
          <CalendarTitle>Escolha a data</CalendarTitle>

          <OpenDayPickerButton onPress={handleToggleTimePicker}>
            <OpenDayPickerButtonText>
              Selecionar outra data
            </OpenDayPickerButtonText>
          </OpenDayPickerButton>
          {showDateTimePicker && (
            <Datetimepicker
              mode="date"
              display="calendar"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <ScheduleTitle>Escolha o horário</ScheduleTitle>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(item => (
                <Hour
                  enabled={item.available}
                  selected={selectedHour === item.hour}
                  onPress={() => handleSelectHour(item.hour)}
                  available={item.available}
                  key={item.hour}
                >
                  <HourText selected={selectedHour === item.hour}>
                    {item.hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(item => (
                <Hour
                  enabled={item.available}
                  selected={selectedHour === item.hour}
                  onPress={() => handleSelectHour(item.hour)}
                  available={item.available}
                  key={item.hour}
                >
                  <HourText selected={selectedHour === item.hour}>
                    {item.hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
