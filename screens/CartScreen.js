import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from "react-native";
import { auth, database } from "../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const r = ref(database, `carts/${uid}`);

    const unsubscribe = onValue(r, async (snapshot) => {
      const val = snapshot.exists() ? snapshot.val() : {};
      setCart(val);
      setLoading(false);
      await AsyncStorage.setItem("@cart_" + uid, JSON.stringify(val));
    });

    return () => unsubscribe();
  }, []);

  const keys = Object.keys(cart);
  const total = keys.reduce(
    (s, k) => s + cart[k].product.price * cart[k].qty,
    0
  );

  const changeQty = async (key, qty) => {
    const uid = user.uid;
    if (qty <= 0) {
      await remove(ref(database, `carts/${uid}/${key}`));
    } else {
      await update(ref(database, `carts/${uid}/${key}`), { qty });
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  if (keys.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Your cart is empty</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={keys}
        keyExtractor={(k) => k}
        renderItem={({ item: key }) => {
          const it = cart[key];
          return (
            <View style={styles.row}>
              <Image source={{ uri: it.product.image }} style={styles.img} />
              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text numberOfLines={1}>{it.product.title}</Text>
                <Text>R {Number(it.product.price).toFixed(2)}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => changeQty(key, it.qty - 1)}
                    style={styles.qbtn}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 8 }}>{it.qty}</Text>
                  <TouchableOpacity
                    onPress={() => changeQty(key, it.qty + 1)}
                    style={styles.qbtn}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => remove(ref(database, `carts/${user.uid}/${key}`))}
              >
                <Text style={{ color: "red" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={{ padding: 12, borderTopWidth: 1, borderColor: "#eee" }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Total: R {total.toFixed(2)}
        </Text>
        <View style={{ marginTop: 12 }}>
          <Button
            title="Checkout (demo)"
            onPress={() => alert("Checkout flow not implemented")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  img: { width: 60, height: 60 },
  qbtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
});
