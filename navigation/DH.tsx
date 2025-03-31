import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import Home from '../Views/HomeScreen';
import Details from '../Views/Details';
import TG from '../Views/SearchView';
import LG from '../Views/Login';
import SU from '../Views/SignUp';
import Search from '../Views/SearchView';

// Tạo Stack Navigator
const Stack = createStackNavigator();

export default class TabHome extends Component {
    render() {
        return (
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    animation: Platform.OS === 'ios' ? 'default' : 'none',
                    headerShown: false
                }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Details" component={Details} />
                <Stack.Screen name="TG" component={TG} />
                <Stack.Screen name="LG" component={LG} />
                <Stack.Screen name="Su" component={SU} />
                <Stack.Screen name="Search" component={Search} />
            </Stack.Navigator>
        );
    }
}
