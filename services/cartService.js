import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
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
    const cartRef = ref(database, `carts/${uid}`);

    const unsubscribe = onValue(cartRef, async (snapshot) => {
      const val = snapshot.exists() ? snapshot.val() : {};
      setCart(val);
      setLoading(false);
      try {
        await AsyncStorage.setItem("@cart_" + uid, JSON.stringify(val));
      } catch (e) {
        console.log("Local save error", e);
      }
    });
    (async () => {
      try {
        const local = await AsyncStorage.getItem("@cart_" + uid);
        if (local && Object.keys(cart).length === 0) {
          setCart(JSON.parse(local));
          setLoading(false);
        }
      } catch (e) {
        console.log("Local load error", e);
      }
    })();

    return () => unsubscribe();
  }, []);

  const keys = Object.keys(cart);
  const total = keys.reduce(
    (sum, k) => sum + cart[k].product.price * cart[k].qty,
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading your cart...</Text>
      </View>
    );
  }

  if (keys.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "gray" }}>
          Your cart is empty 
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={keys}
        keyExtractor={(k) => k}
        renderItem={({ item: key }) => {
          const item = cart[key];
          return (
            <View style={styles.row}>
              <Image
                source={{ uri: item.product.image }}
                style={styles.img}
                resizeMode="contain"
              />
              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text numberOfLines={1} style={styles.title}>
                  {item.product.title}
                </Text>
                <Text>R {Number(item.product.price).toFixed(2)}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => changeQty(key, item.qty - 1)}
                    style={styles.qbtn}
                  >
                    <Text style={{ fontSize: 18 }}>−</Text>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 8 }}>{item.qty}</Text>
                  <TouchableOpacity
                    onPress={() => changeQty(key, item.qty + 1)}
                    style={styles.qbtn}
                  >
                    <Text style={{ fontSize: 18 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => remove(ref(database, `carts/${user.uid}/${key}`))}
              >
                <Text style={{ color: "red", fontWeight: "600" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: R {total.toFixed(2)}</Text>
        <Button
          title="Checkout (Demo)"
          onPress={() => alert("Checkout process not implemented yet.")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    backgroundColor: "#f7f7f7",
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  totalText: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  title: { fontWeight: "500" },
});
