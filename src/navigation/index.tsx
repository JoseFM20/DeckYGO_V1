import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardListScreen from '../screens/CardListScreen';
import CardDetailsScreen from '../screens/CardDetailScreen';
import DeckBuilderScreen from '../screens/DeckBuilderScreen';

import { TouchableOpacity, Text } from 'react-native';


const Stack = createNativeStackNavigator();


export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={CardListScreen}
                    options={({ navigation }) => ({
                        title: 'Yu-Gi-Oh',
                        headerRight: () => (
                            <React.Fragment>
                                <DecksButton onPress={() => navigation.navigate('DeckBuilder')} />
                            </React.Fragment>
                        ),
                    })}
                />
                <Stack.Screen name="Details" component={CardDetailsScreen} options={{ title: 'Detalle' }} />
                <Stack.Screen name="DeckBuilder" component={DeckBuilderScreen} options={{ title: 'Armar Deck' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
// Simple button for header
function DecksButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={{ marginRight: 8 }}>
            <Text style={{ color: '#228B22', fontWeight: 'bold', fontSize: 16 }}>Decks</Text>
        </TouchableOpacity>
    );
}
}