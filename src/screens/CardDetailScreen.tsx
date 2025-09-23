import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCardById } from '../api/ygoapi';
import { Card } from '../models/Card';


export default function CardDetailsScreen({ route }: any) {
    const { id } = route.params;
    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let mounted = true;
        fetchCardById(id).then((c) => { if (mounted) setCard(c); }).catch(()=>{}).finally(()=>{ if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [id]);


    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
    if (!card) return <Text style={{ padding: 16 }}>Carta no encontrada</Text>;


    const img = card.card_images?.[0]?.image_url;


    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            {img ? <Image source={{ uri: img }} style={styles.image} /> : null}
            <Text style={styles.title}>{card.name}</Text>
            <Text style={styles.meta}>{card.type} • {card.race} • {card.archetype || ''}</Text>
            <Text style={styles.desc}>{card.desc}</Text>
            <View style={styles.stats}>
                <Text>ATK: {card.atk ?? '-'}</Text>
                <Text>DEF: {card.def ?? '-'}</Text>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { width: '100%', height: 420, resizeMode: 'contain', marginBottom: 12 },
    title: { fontSize: 20, fontWeight: '700' },
    meta: { color: '#666', marginTop: 6 },
    desc: { marginTop: 12, lineHeight: 20 },
    stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});