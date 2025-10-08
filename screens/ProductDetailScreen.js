import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, TextInput } from "react-native";
import { database, auth } from "../firebase";
import { ref, set, get, child, push, update } from "firebase/database";

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const [qty, setQty] = useState("1");
  const user = auth.currentUser;

  const addToCart = async () => {
    if (!user) return alert("Please login first.");
    const uid = user.uid;
    const cartRef = ref(database, `carts/${uid}`);

    try {
      const snapshot = await get(cartRef);
      let cart = snapshot.exists() ? snapshot.val() : {};

      const foundKey = Object.keys(cart).find(
        (k) => cart[k].product.id === product.id
      );

      if (foundKey) {
        const existing = cart[foundKey];
        const newQty = existing.qty + Number(qty);
        await update(ref(database, `carts/${uid}/${foundKey}`), { qty: newQty });
      } else {
        const newItemRef = push(cartRef);
        await set(newItemRef, { product, qty: Number(qty) });
      }

      alert("Added to cart!");
    } catch (e) {
      console.error(e);
      alert("Failed to add to cart");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", height: 300 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
        {product.title}
      </Text>
      <Text style={{ marginTop: 8 }}>{product.description}</Text>
      <Text style={{ marginTop: 8, fontSize: 18, fontWeight: "700" }}>
        R {Number(product.price).toFixed(2)}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <Text>Quantity: </Text>
        <TextInput
          value={qty}
          onChangeText={setQty}
          keyboardType="number-pad"
          style={styles.qty}
        />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title="Add to Cart" onPress={addToCart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qty: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 60,
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
  },
});
