import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import NewGameScreen from '../screens/NewGameScreen';
import GameScreen from '../screens/GameScreen';
import EndGameScreen from '../screens/EndGameScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PlayersScreen from '../screens/PlayersScreen';
import PlayerDetailScreen from '../screens/PlayerDetailScreen';
import AddGameScreen from '../screens/AddGameScreen';

export type RootStackParamList = {
  Home: undefined;
  NewGame: undefined;
  Game: { gameId: string };
  EndGame: { gameId: string };
  History: undefined;
  Players: undefined;
  PlayerDetail: { playerId: string };
  AddGame: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewGame" component={NewGameScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="EndGame" component={EndGameScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Players" component={PlayersScreen} />
        <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} />
        <Stack.Screen name="AddGame" component={AddGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}