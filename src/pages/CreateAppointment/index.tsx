import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
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
} from './styles';

interface RouteParams {
  providerID: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { goBack } = useNavigation();
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);

  const { providerID } = route.params as RouteParams;
  const [selectedProvider, setSelectedProvider] = useState(providerID);

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

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToProfile}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

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
    </Container>
  );
};

export default CreateAppointment;
