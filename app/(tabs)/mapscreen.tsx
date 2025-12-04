import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onValue, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { realtimeDB } from "../firebaseConfig";

export default function MapsScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  // LOAD DATA
  useEffect(() => {
    const ordersRef = ref(realtimeDB, "orders/");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setOrders(list);
      }
    });

    return () => unsubscribe();
  }, []);

  // HAPUS ORDER
  const handleDelete = () => {
    Alert.alert(
      "Hapus Pesanan?",
      "Pesanan akan dihapus secara permanen.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await remove(ref(realtimeDB, `orders/${selected.id}`));
            setSelected(null);
          },
        },
      ]
    );
  };

  // FORMAT MARKER
  const getCoordinate = (order: any) => {
    if (order.mode === "delivery") {
      // gunakan lat & lng asli dari database
      if (order.delivery?.lat && order.delivery?.lng) {
        return {
          lat: order.delivery.lat,
          lng: order.delivery.lng,
        };
      }
      return null;
    }

    // pickup mode
    if (order.mode === "pickup" && order.pickup) {
      return {
        lat: order.pickup.storeLat,
        lng: order.pickup.storeLng,
      };
    }

    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>

      {/* MAP */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -7.77,
          longitude: 110.38,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {orders.map((order) => {
          const coord = getCoordinate(order);
          if (!coord) return null;

          return (
            <Marker
              key={order.id}
              coordinate={{
                latitude: coord.lat,
                longitude: coord.lng,
              }}
              pinColor={order.mode === "delivery" ? "red" : "blue"}
              onPress={() => setSelected(order)}
            />
          );
        })}
      </MapView>

      {/* INFO CARD */}
      {selected && (
        <View style={styles.card}>
          <Text style={styles.title}>{selected.name}</Text>
          <Text style={styles.text}>Mode: {selected.mode}</Text>
          <Text style={styles.text}>
            Total: Rp{" "}
            {(
              (selected.subtotal || 0) +
              (selected?.delivery?.shippingCost || 0)
            ).toLocaleString()}
          </Text>

          {selected.mode === "delivery" && selected.delivery?.address && (
            <Text style={styles.text}>
              Alamat: {selected.delivery.address}
            </Text>
          )}

          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: { id: selected.id },
              })
            }
          >
            <Text style={styles.btnText}>Lihat Detail Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#d9534f", marginTop: 10 }]}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>Hapus Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelected(null)}
          >
            <Text style={styles.closeText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    zIndex: 999,
    top: 45,
    left: 20,
    backgroundColor: "white",
    width: 42,
    height: 42,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  card: {
    position: "absolute",
    bottom: 20,
    left: 18,
    right: 18,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: "700" },
  text: { marginTop: 4, fontSize: 14, opacity: 0.8 },
  btn: {
    marginTop: 14,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "700" },
  closeBtn: { marginTop: 10, padding: 8 },
  closeText: { textAlign: "center", color: "red", fontWeight: "700" },
});
