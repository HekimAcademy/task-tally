import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { View, Text } from 'react-native'
import HomeScreen from '../screens/Home';
import SignIn from '../screens/SignIn'
import Splash from '../screens/Splash';
import SignUp from '../screens/SignUp';
import Projects from '../screens/Projects';
import Departmans from '../screens/Departmans'
import Users from '../screens/Users';
import Admin from '../screens/Admin';
import Proje from '../screens/Proje';

const stack = createNativeStackNavigator();


export default function appNavigation() {
  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Splash'>
        <stack.Screen name='Splash' options={{ headerShown: false }} component={Splash} />
        <stack.Screen name='SignIn' options={{ headerShown: false }} component={SignIn} />
        <stack.Screen name='SignUp' options={{ headerShown: false }} component={SignUp} />
        <stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen} /> 
        <stack.Screen name='Projects' options={{ headerShown: false }} component={Projects} />
        <stack.Screen name='Departmans' options={{ headerShown: false }} component={Departmans} />
        <stack.Screen name='Users' options={{ headerShown: false }} component={Users} />
        <stack.Screen name='Admin' options={{ headerShown: false }} component={Admin} />
        <stack.Screen name='Proje' options={{ headerShown: false }} component={Proje} />


      </stack.Navigator>
    </NavigationContainer>
  )
}