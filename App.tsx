import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigation/RootNavigation'; // 

import AppNavigator from './navigation/BottomTabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeList from './Views/RecipeList';
import Details from './Views/Details';
import SignUpScreen from './Views/SignUp';
import LoginScreen from './Views/Login';
import SearchView from './Views/SearchView';
import { RootStackParamList } from './types'; 
import HomeScreen from './Views/HomeScreen';
import TabHome from './navigation/DH'; 
import FavoriteRecipes from './Views/FavoriteRecipes';
import NetInfo from "@react-native-community/netinfo";
import { getUserData } from "./models/authHelper";
import { syncFavoritesWithServer } from './models/syncFavoritesWithServer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const {token, refreshToken} = await getUserData();
  //     console.log("Token sau khi mở lại app:", token,"123",refreshToken);
  //   };
  
  //   checkToken();
  // }, []);
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabNavigator" component={AppNavigator} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RecipeList" component={RecipeList} />
        <Stack.Screen name="SearchView" component={SearchView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>

  );
};

export default App;
