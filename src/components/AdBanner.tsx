import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AdBanner: React.FC = () => (
  <View style={styles.bar}>
    <View style={styles.pill}>
      <Text style={styles.adTag}>AD</Text>
    </View>
    <Text style={styles.text}>[ ADVERTISEMENT PLACEHOLDER ]</Text>
  </View>
);

const styles = StyleSheet.create({
  bar: {
    height: 50,
    backgroundColor: '#08090C',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(102,252,241,0.12)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#45A29E',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  adTag: { color: '#45A29E', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  text: { color: 'rgba(100,100,100,0.7)', fontSize: 10, letterSpacing: 1 },
});
