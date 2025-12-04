import * as Location from "expo-location";
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
import MapView, { Marker } from "react-native-maps";

import { useLocalSearchParams, useRouter } from "expo-router";
import { get, ref, update } from "firebase/database";
import { realtimeDB } from "./firebaseConfig";

const COLORS = {
  primary: "#0F3D2E",
  secondary: "#88A47C",
  accent: "#D9A441",
  background: "#F4EED8",
  text: "#1A1A1A",
};

// lokasi toko (fallback pickup)
const STORE_LOCATION = {
  latitude: -7.777,
  longitude: 110.380,
};

export default function EditOrderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState("delivery");

  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);

  // Map state
  const [region, setRegion] = useState({
    latitude: -7.777,
    longitude: 110.380,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [marker, setMarker] = useState(null);

  useEffect(() => {
    async function load() {
      const snap = await get(ref(realtimeDB, `orders/${id}`));
      if (!snap.exists()) {
        Alert.alert("Error", "Pesanan tidak ditemukan.");
        return;
      }

      const data = snap.val();

      // FORM FIELDS
      setName(data.name || "");
      setPhone(data.phone || "");
      setNote(data.note || "");
      setMode(data.mode || "delivery");

      setAddress(data.delivery?.address || "");
      setCart(Array.isArray(data.cart) ? data.cart : []);

      // DELIVERY LOCATION
      const latRaw = data.delivery?.lat;
      const lngRaw = data.delivery?.lng;

      // FIX: nilai negatif tidak boleh dianggap falsy
      if (latRaw != null && lngRaw != null) {
        const lat = Number(latRaw);
        const lng = Number(lngRaw);

        if (!isNaN(lat) && !isNaN(lng)) {
          setMarker({ latitude: lat, longitude: lng });

          setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  // SAVE BUTTON
  async function saveChanges() {
    if (!name.trim()) {
      Alert.alert("Error", "Nama pemesan wajib diisi!");
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    const shippingCost = mode === "delivery" ? 5000 : 0;
    const grandTotal = subtotal + shippingCost;

    const payload = {
      name,
      phone,
      note,
      mode,
      cart,
      subtotal,
      shippingCost,
      grandTotal,
      delivery: {
        address: mode === "delivery" ? address : "Pickup - Lokasi Toko",
        lat:
          mode === "delivery" && marker
            ? marker.latitude
            : STORE_LOCATION.latitude,
        lng:
          mode === "delivery" && marker
            ? marker.longitude
            : STORE_LOCATION.longitude,
      },
    };

    await update(ref(realtimeDB, `orders/${id}`), payload);

    Alert.alert("Berhasil", "Perubahan disimpan!");
    router.back();
  }

  // GET MY LOCATION
  const getMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Lokasi Ditolak");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const lat = loc.coords.latitude;
    const lng = loc.coords.longitude;

    setMarker({ latitude: lat, longitude: lng });
    setRegion({
      ...region,
      latitude: lat,
      longitude: lng,
    });
  };

  // SET STORE LOCATION
  const applyStoreLocation = () => {
    setMarker({ ...STORE_LOCATION });
    setRegion({
      ...region,
      ...STORE_LOCATION,
    });
  };

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Pesanan</Text>

      <Text style={styles.label}>Nama Pemesan</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Nomor Telepon</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Catatan</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} />

      <View style={styles.itemCard}>
        <Text style={styles.label}>Item Pesanan</Text>

        {cart.map((item, i) => (
          <View key={i} style={styles.rowBetween}>
            <Text style={styles.value}>
              {item.name} × {item.quantity}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Mode Pesanan</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "delivery" && styles.modeSelected]}
          onPress={() => setMode("delivery")}
        >
          <Text
            style={[
              styles.modeText,
              mode === "delivery" && styles.modeTextSelected,
            ]}
          >
            Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === "pickup" && styles.modeSelected]}
          onPress={() => {
            setMode("pickup");
            applyStoreLocation();
          }}
        >
          <Text
            style={[
              styles.modeText,
              mode === "pickup" && styles.modeTextSelected,
            ]}
          >
            Pickup
          </Text>
        </TouchableOpacity>
      </View>

      {mode === "delivery" && (
        <>
          <Text style={styles.label}>Lokasi Pengiriman</Text>

          <MapView
            style={styles.map}
            region={region}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarker({ latitude, longitude });
            }}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>

          <TouchableOpacity style={styles.locBtn} onPress={getMyLocation}>
            <Text style={styles.locText}>Gunakan Lokasi Saya</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Alamat Pengiriman</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        </>
      )}

      {mode === "pickup" && (
        <TouchableOpacity
          style={[styles.locBtn, { marginTop: 14 }]}
          onPress={applyStoreLocation}
        >
          <Text style={styles.locText}>Gunakan Lokasi Toko</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Simpan Perubahan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Batal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
  label: { marginTop: 14, fontSize: 14, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  value: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 10, gap: 10 },
  modeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  modeSelected: { backgroundColor: COLORS.primary },
  modeText: { textAlign: "center", fontWeight: "600" },
  modeTextSelected: { color: "white" },
  map: { width: "100%", height: 200, borderRadius: 12, marginTop: 10 },
  locBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  locText: { color: "white", fontWeight: "700", textAlign: "center" },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
  },
  saveText: { textAlign: "center", color: "white", fontSize: 16 },
  cancelBtn: { marginTop: 16 },
  cancelText: { textAlign: "center", color: "#B00020", fontWeight: "700" },
});
