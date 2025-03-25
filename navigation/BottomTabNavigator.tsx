import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import HomeScreen from '../Views/HomeScreen'; 
import RecipeScreen from '../Views/RecipeList'; 
import login from '../Views/Login';
import sign from '../Views/SignUp';
import view from '../Views/SearchView';
import TabHome from './DH';


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
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Tìm kiếm" component={TabHome} />
      <Tab.Screen name="Kho món ngon" component={RecipeScreen} />
      <Tab.Screen name="login" component={login} />
      <Tab.Screen name="sign" component={sign} />
      
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
