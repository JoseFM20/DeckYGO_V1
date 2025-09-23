import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardListScreen from '../screens/CardListScreen';
import CardDetailsScreen from '../screens/CardDetailScreen';


const Stack = createNativeStackNavigator();


export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={CardListScreen} options={{ title: 'Yu-Gi-Oh' }} />
                <Stack.Screen name="Details" component={CardDetailsScreen} options={{ title: 'Detalle' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}