import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { View, Text } from 'react-native'
import HomeScreen from '../screens/Home';
import welcome from '../screens/welcome'
import SignUp from '../screens/SignUp'
import SignIn from '../screens/SignIn'
const stack = createNativeStackNavigator();


export default function appNavigation() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name='Welcome' options={{ headerShown: false }} component={welcome} />
        <stack.Screen name='SignIn' options={{ headerShown: false }} component={SignIn} />
        <stack.Screen name='SignUp' options={{ headerShown: false }} component={SignUp} />
        <stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen} />

      </stack.Navigator>
    </NavigationContainer>
  )
}