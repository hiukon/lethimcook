import React from 'react';
import AppNavigator from './navigation/BottomTabNavigator';
import HomeLogin from './navigation/HomeLogin';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeList from './Views/RecipeList';
import Details from './Views/Details';
import { RouteProp } from '@react-navigation/native';
import SignUpScreen from './Views/SignUp';
import LoginScreen from './Views/Login';
import SearchView from './Views/SearchView';
import { RootStackParamList } from './types'; 
import HomeScreen from './Views/HomeScreen';
import TabHome from './navigation/DH'; 
import FavoriteRecipes from './Views/FavoriteRecipes';
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (     
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name ="HomeLogin" component={HomeLogin} /> */}
      <Stack.Screen name ="BottomTabNavigator" component={AppNavigator} />
      <Stack.Screen name="HomeScreen" component={HomeScreen}  />
      <Stack.Screen name="RecipeList" component={RecipeList}  />
      <Stack.Screen name="SearchView" component={SearchView} />
      <Stack.Screen name="Details" component={Details}  />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="FavoriteRecipes" component={FavoriteRecipes} /> */}
    </Stack.Navigator>
  );
};

export default App;
