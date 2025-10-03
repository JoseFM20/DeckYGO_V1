import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import SearchBar from '../components/SearchBar';
import { useCards } from '../hooks/useCards';
import CardItem from '../components/CardItem';

export default function DeckBuilderScreen() {
    const { cards, loading, searchByName, loadAll } = useCards();
    const [deck, setDeck] = useState<any[]>([]);
    const [sideDeck, setSideDeck] = useState<any[]>([]);
    const [messages, setMessages] = useState<{ id: number, text: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState<{ id: number, text: string } | null>(null);

    // Agregar carta al deck (máximo 3 copias por carta, máximo 60 cartas)
    const addToDeck = (card: any) => {
        const totalCount = deck.filter(c => c.id === card.id).length + sideDeck.filter(c => c.id === card.id).length;
        if (totalCount >= 3) return; // No permitir más de 3 copias en total
        if (deck.length < 60 && deck.filter(c => c.id === card.id).length < 3) {
            setDeck([...deck, card]);
            const id = Date.now() + Math.random();
            setMessages((prev) => [...prev, { id, text: `Agregada: ${card.name} al Main Deck` }]);
        } else if (sideDeck.length < 15 && sideDeck.filter(c => c.id === card.id).length < 3) {
            setSideDeck([...sideDeck, card]);
            const id = Date.now() + Math.random();
            setMessages((prev) => [...prev, { id, text: `Agregada: ${card.name} al Side Deck` }]);
        }
    };

    // Quitar carta del deck (solo una copia)
    const removeFromDeck = (card: any) => {
        const idx = deck.findIndex(c => c.id === card.id);
        if (idx !== -1) {
            const newDeck = [...deck];
            newDeck.splice(idx, 1);
            setDeck(newDeck);
        }
    };

    // Llenar automáticamente el main y side deck
    function shuffleArray<T>(array: T[]): T[] {
        return array
            .map((a) => [Math.random(), a] as [number, T])
            .sort((a, b) => a[0] - b[0])
            .map((a) => a[1]);
    }

    const fillDecks = () => {
        let main: any[] = [];
        let side: any[] = [];
        let counts: Record<string, number> = {};
        for (let card of cards) {
            counts[card.id] = 0;
        }
        // Mezclar cartas para combinaciones distintas
        const shuffled = shuffleArray(cards);
        // Llenar main deck
        for (let card of shuffled) {
            let toAdd = Math.min(3, 60 - main.length);
            while (toAdd > 0 && main.length < 60 && counts[card.id] < 3) {
                main.push(card);
                counts[card.id]++;
                toAdd--;
            }
            if (main.length >= 60) break;
        }
        // Mezclar de nuevo para el side deck
        const shuffledSide = shuffleArray(cards);
        for (let card of shuffledSide) {
            let toAdd = Math.min(3 - (counts[card.id] || 0), 15 - side.length);
            while (toAdd > 0 && side.length < 15 && counts[card.id] < 3) {
                side.push(card);
                counts[card.id]++;
                toAdd--;
            }
            if (side.length >= 15) break;
        }
        setDeck(main);
        setSideDeck(side);
        setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text: 'Decks llenados aleatoriamente' }]);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
                <SearchBar onSearch={q => q ? searchByName(q) : loadAll()} />
            </View>
            <FlatList
                data={cards}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                    <CardItem card={item} onPress={() => addToDeck(item)} />
                )}
                ListHeaderComponent={
                    <View style={{ padding: 16, paddingBottom: 32 }}>
                        <Text style={styles.title}>Deck Builder</Text>
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Acciones rápidas</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <Text
                                    style={{ backgroundColor: '#228B22', color: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, fontWeight: 'bold', overflow: 'hidden', marginRight: 8, flexDirection: 'row', alignItems: 'center', fontSize: 16 }}
                                    onPress={fillDecks}
                                >
                                    <Text style={{ fontSize: 18, marginRight: 6 }}></Text>
                                    Randomize
                                </Text>
                                <Text
                                    style={{
                                        backgroundColor: (deck.length === 0 && sideDeck.length === 0) ? '#ccc' : '#B22222',
                                        color: 'white',
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        fontWeight: 'bold',
                                        overflow: 'hidden',
                                        opacity: (deck.length === 0 && sideDeck.length === 0) ? 0.6 : 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        fontSize: 16,
                                    }}
                                    onPress={() => {
                                        if (deck.length === 0 && sideDeck.length === 0) return;
                                        Alert.alert(
                                            '¿Limpiar Decks?',
                                            '¿Estás seguro de que quieres eliminar todas las cartas del Main y Side Deck?',
                                            [
                                                { text: 'Cancelar', style: 'cancel' },
                                                { text: 'Limpiar', style: 'destructive', onPress: () => {
                                                    setDeck([]);
                                                    setSideDeck([]);
                                                    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text: 'Decks limpiados' }]);
                                                } }
                                            ]
                                        );
                                    }}
                                >
                                    <Text style={{ fontSize: 18, marginRight: 6 }}></Text>
                                    Clear
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Main Deck</Text>
                        <Text style={{ marginBottom: 8 }}>Cartas en Deck: {deck.length} / 60</Text>
                        <View style={{ minHeight: 60, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16, backgroundColor: '#f8f8f8' }}>
                            <FlatList
                                data={deck}
                                keyExtractor={(item, idx) => `${item.id}-${idx}`}
                                numColumns={6}
                                renderItem={({ item }) => (
                                    <View style={{ width: 52, height: 72, margin: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <CardItem card={item} hideText={true} onPress={() => removeFromDeck(item)} imgSize={48} />
                                    </View>
                                )}
                                contentContainerStyle={{ gap: 4 }}
                                ListEmptyComponent={<View style={{ height: 20 }} />}
                            />
                        </View>
                        <Text style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>Side Deck</Text>
                        <Text style={{ marginBottom: 8 }}>Cartas en Side Deck: {sideDeck.length} / 15</Text>
                        <View style={{ minHeight: 60, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }}>
                            <FlatList
                                data={sideDeck}
                                keyExtractor={(item, idx) => `${item.id}-${idx}`}
                                numColumns={6}
                                renderItem={({ item }) => (
                                    <View style={{ width: 52, height: 72, margin: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <CardItem card={item} hideText={true} onPress={() => {
                                            // Quitar del side deck
                                            const idx = sideDeck.findIndex(c => c.id === item.id);
                                            if (idx !== -1) {
                                                const newSide = [...sideDeck];
                                                newSide.splice(idx, 1);
                                                setSideDeck(newSide);
                                            }
                                        }} imgSize={48} />
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={{ color: '#aaa', textAlign: 'center' }}>Agrega cartas al Side Deck</Text>}
                            />
                        </View>
                    </View>
                }
            />
            {/* Mensaje flotante tipo toast en la parte inferior */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', zIndex: 100 }} pointerEvents="none">
                {currentMessage && <FadeMessage key={currentMessage.id} text={currentMessage.text} />}
            </View>
        </View>
    );
// Mensaje desvaneciente tipo toast
function FadeMessage({ text }: { text: string }) {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        opacity.setValue(1);
        const anim = Animated.timing(opacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
        });
        anim.start();
        return () => anim.stop();
    }, [text]);
    return (
        <Animated.View style={{ opacity, backgroundColor: '#228B22', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24, margin: 4, minWidth: 120 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{text}</Text>
        </Animated.View>
    );
}

// Mostrar mensajes uno por uno
useEffect(() => {
    if (!currentMessage && messages.length > 0) {
        setCurrentMessage(messages[0]);
        const timer = setTimeout(() => {
            setMessages((prev) => prev.slice(1));
            setCurrentMessage(null);
        }, 1300);
        return () => clearTimeout(timer);
    }
}, [messages, currentMessage]);
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
});
