import React from 'react';
import { View, FlatList, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { useCards } from '../hooks/useCards';
import CardItem from '../components/CardItem';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';


export default function CardListScreen() {
    const { cards, loading, error, searchByName } = useCards();
    const navigation = useNavigation<any>();


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SearchBar onSearch={(q) => searchByName(q)} />
            {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}
            {error ? <Text style={{ color: 'red', padding: 8 }}>{error}</Text> : null}
            <FlatList
                data={cards}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <CardItem
                        card={item}
                        onPress={() => navigation.navigate('Details', { id: item.id })}
                    />
                )}
            />
        </SafeAreaView>
    );
}