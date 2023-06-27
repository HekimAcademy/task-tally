// NavigationConfig.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';

import HomeScreen from '../screens/Home';

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator initialRouteName="SignIn">
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

const HomeNavigator = () => (
  <HomeStack.Navigator initialRouteName="Home">
    <HomeStack.Screen name="Home" component={HomeScreen} />
  </HomeStack.Navigator>
);

const NavigationConfig = () => (
  <NavigationContainer>
    <HomeNavigator/>
  </NavigationContainer>
);

export default NavigationConfig;

// {userLoggedIn ? <HomeNavigator /> : <AuthNavigator />}