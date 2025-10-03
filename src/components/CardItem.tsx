import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../models/Card';


interface Props {
    card: Card;
    onPress?: () => void;
    hideText?: boolean;
    imgSize?: number;
}


export default function CardItem({ card, onPress, hideText, imgSize }: Props) {
    const img = card.card_images?.[0]?.image_url_small || card.card_images?.[0]?.image_url;
    // Get price from card_prices (TCGPlayer or Amazon)
    let priceText = 'Precio: No disponible';
    if (card.card_prices && card.card_prices.length > 0) {
        const prices = card.card_prices[0];
        if (prices.tcgplayer_price && prices.tcgplayer_price !== "0.00") {
            priceText = `TCGPlayer: $${prices.tcgplayer_price}`;
        } else if (prices.amazon_price && prices.amazon_price !== "0.00") {
            priceText = `Amazon: $${prices.amazon_price}`;
        }
    }
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {img ? <Image source={{ uri: img }} style={[styles.image, imgSize ? { width: imgSize, height: imgSize * 1.375, marginRight: 0 } : {}]} /> : null}
            {!hideText ? (
                <View style={styles.content}>
                    <Text numberOfLines={1} style={styles.title}>{card.name}</Text>
                    <Text numberOfLines={2} style={styles.subtitle}>{card.type} • {card.race || ''}</Text>
                    <Text style={styles.price}>{priceText}</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    image: { width: 64, height: 88, resizeMode: 'contain', marginRight: 12 },
    content: { flex: 1 },
    title: { fontWeight: '700' },
    subtitle: { color: '#666', marginTop: 4 },
    price: { color: '#228B22', marginTop: 4, fontWeight: '600' },
});