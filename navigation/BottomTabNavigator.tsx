import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Favorites from '../Views/FavoriteRecipes'; 
import login from '../Views/Login';
import sign from '../Views/SignUp';
import view from '../Views/SearchView';
import TabHome from './DH';
    type RootStackParamList = {
      SignUp: undefined;
      HomeScreen: undefined; 
      BottomTabNavigator: { screen: string, params: { screen: string; } }; 
    };

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator 
    
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Tìm kiếm') {
            iconName = focused ? 'search-outline' : 'search-outline';
          } else if (route.name === 'Kho món ngon') {
            iconName = focused ? 'book' : 'book-outline';
          } 

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { height: 50, paddingBottom: 5 },
      })}>
      <Tab.Screen name="Tìm kiếm" component={TabHome} />
      <Tab.Screen name="Kho món ngon" component={Favorites} />
      <Tab.Screen name="login" component={login} />
      
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
