import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FieldListScreen from '../screens/FieldListScreen';
import FieldFormScreen from '../screens/FieldFormScreen';
import FieldDetailScreen from '../screens/FieldDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FieldList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FieldList" component={FieldListScreen} />
      <Stack.Screen name="FieldForm" component={FieldFormScreen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
    </Stack.Navigator>
  );
}
