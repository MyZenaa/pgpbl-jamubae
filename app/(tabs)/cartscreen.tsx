import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import cartService from "../cart/cartService";
import CartList from "../cart/cartList";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
}

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const unsub = cartService.listenCart((items) => {
      setCart(items);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const updateCartQuantity = (id: string, qty: number) =>
    cartService.updateQuantity(id, qty);

  const deleteCartItem = (id: string) => cartService.remove(id);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* HEADER MELENGKUNG */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang</Text>
      </View>

      <Animated.View
        style={{ flex: 1, opacity: fadeAnim, marginTop: -20, paddingHorizontal: 8 }}
      >
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 160 }}
          renderItem={({ item }) => (
            <CartList
              item={item}
              updateCartQuantity={updateCartQuantity}
              deleteCartItem={deleteCartItem}
            />
          )}
        />
      </Animated.View>

      {/* Bottom Checkout */}
      <View style={styles.checkoutContainer}>
        <View style={styles.totalWrapper}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp {total.toLocaleString()}</Text>
        </View>

        <Link href="/checkout" asChild>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Lanjut ke Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6ef",
  },

  header: {
    backgroundColor: "#0F3D2E",
    height: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "flex-end",
    paddingBottom: 28,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "##0F3D2E",
  },
  price: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  qtyBtn: {
    backgroundColor: "#2f4a2f22",
    padding: 6,
    borderRadius: 10,
  },
  qty: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: "700",
    color: "#0F3D2E",
  },

  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 30,
  },
  totalWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2f4a2f",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2f4a2f",
  },
  checkoutBtn: {
    backgroundColor: "#2f4a2f",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 6,
  },
  checkoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
