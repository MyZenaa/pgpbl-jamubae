import { useRouter } from "expo-router";
import { push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MiniMap from "./MiniMap";
import PickupMap from "./PickupMap";
import cartService from "./cart/cartService";
import { realtimeDB } from "./firebaseConfig";

export default function CheckoutScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [coordinate, setCoordinate] = useState({
    lat: null,
    lng: null,
    distance: 0,
    shippingCost: 0,
  });

  useEffect(() => {
    const unsub = cartService.listenCart((items) => setCart(items));
    return () => unsub && unsub();
  }, []);

  const handlePlaceOrder = async () => {
    if (!name.trim()) return Alert.alert("Nama wajib diisi");
    if (!phone.trim()) return Alert.alert("Nomor WhatsApp wajib diisi");
    if (cart.length === 0) return Alert.alert("Keranjang kosong");

    if (mode === "delivery") {
      if (!deliveryAddress.trim()) return Alert.alert("Alamat belum diisi");
      if (!coordinate.lat || !coordinate.lng)
        return Alert.alert("Lokasi pengiriman belum dipilih");
    }

    const orderData: any = {
      name,
      phone,
      cart,
      subtotal: total,
      mode,
      timestamp: Date.now(),
    };

    if (mode === "pickup") {
      orderData.pickup = {
        storeName: "Toko Jamu Sehat Sentosa",
        storeLat: -7.7709,
        storeLng: 110.3779,
      };
    } else {
      orderData.delivery = {
        address: deliveryAddress,
        coordinate,
        shippingCost: coordinate.shippingCost,
        total: total + coordinate.shippingCost,
      };
    }

    try {
      const newRef = push(ref(realtimeDB, "orders/"));
      await set(newRef, orderData);

      // Kosongkan keranjang
      cart.forEach((it) => cartService.remove(it.id));

      router.push({
        pathname: "/order-success",
        params: { orderId: newRef.key },
      });
    } catch (err) {
      Alert.alert("Gagal membuat pesanan");
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <View style={styles.container}>
        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama Anda..."
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Nomor WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="08xxxxxxxxxx"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* SWITCH MODE */}
        <View style={styles.segment}>
          {["pickup", "delivery"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.segmentBtn, mode === type && styles.segmentActive]}
              onPress={() => setMode(type as any)}
            >
              <Text
                style={
                  mode === type
                    ? styles.segmentActiveText
                    : styles.segmentText
                }
              >
                {type === "pickup" ? "Ambil di Toko" : "Diantar ke Rumah"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PICKUP */}
        {mode === "pickup" && (
          <View style={styles.card}>
            <Text style={styles.label}>Lokasi Toko</Text>
            <PickupMap height={240} />
          </View>
        )}

        {/* DELIVERY */}
        {mode === "delivery" && (
          <View style={styles.card}>
            <Text style={styles.label}>Alamat Pengiriman</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan alamat lengkap..."
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>
              Pin Lokasi Anda
            </Text>

            <MiniMap
              height={260}
              mode="delivery"
              onLocationSelect={(coord) => setCoordinate(coord)}
            />

            <Text style={styles.coord}>Latitude: {coordinate.lat ?? "-"}</Text>
            <Text style={styles.coord}>Longitude: {coordinate.lng ?? "-"}</Text>
            <Text style={styles.coord}>
              Jarak: {(coordinate.distance || 0).toFixed(2)} km
            </Text>
            <Text style={styles.coord}>
              Ongkos Kirim: Rp {(coordinate.shippingCost || 0).toLocaleString()}
            </Text>
          </View>
        )}

        {/* RINGKASAN PESANAN */}
        <View style={styles.card}>
          <Text style={styles.label}>Ringkasan Pesanan</Text>

          {cart.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text>
                {item.name} x {item.quantity}
              </Text>
              <Text>
                Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
              </Text>
            </View>
          ))}

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>Rp {(total || 0).toLocaleString()}</Text>
          </View>

          {mode === "delivery" && (
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Ongkir</Text>
              <Text style={styles.totalValue}>
                Rp {(coordinate.shippingCost || 0).toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              Rp{" "}
              {(
                (total || 0) + (mode === "delivery" ? (coordinate.shippingCost || 0) : 0)
              ).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.orderText}>Buat Pesanan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ===========================
        STYLES
=========================== */
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f8f6ef" },

  header: {
    backgroundColor: "#0F3D2E",
    height: 100,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 28,
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },

  container: { padding: 18, marginTop: -20 },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    elevation: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f4a2f",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
    padding: 4,
    marginTop: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#2f4a2f",
  },
  segmentText: { color: "#555", fontWeight: "600" },
  segmentActiveText: { color: "white", fontWeight: "700" },

  coord: {
    opacity: 0.65,
    fontSize: 13,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  totalLabel: {
    fontWeight: "700",
    fontSize: 15,
    color: "#2f4a2f",
  },
  totalValue: {
    fontWeight: "700",
    fontSize: 15,
    color: "#2f4a2f",
  },

  orderBtn: {
    marginTop: 24,
    backgroundColor: "#2f4a2f",
    paddingVertical: 16,
    borderRadius: 14,
  },
  orderText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },
});
