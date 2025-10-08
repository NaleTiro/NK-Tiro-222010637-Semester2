import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <View style={{ padding: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.btn, !selected && styles.active]}
          onPress={() => onSelect(null)}
        >
          <Text style={styles.txt}>All</Text>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.btn, selected === c && styles.active]}
            onPress={() => onSelect(c)}
          >
            <Text style={styles.txt}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 8,
  },
  active: { backgroundColor: "#cde" },
  txt: { textTransform: "capitalize" },
});
