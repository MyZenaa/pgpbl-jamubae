import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

// Haversine
const toRad = (v: number) => (v * Math.PI) / 180;

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function MiniMap({
  height = 260,
  mode = "delivery",
  pickupLocation,
  onLocationSelect,
}: any) {
  const storeLocation = pickupLocation || { latitude: -7.771055, longitude: 110.384504 };

  const [loading, setLoading] = useState(true);
  const [coord, setCoord] = useState(storeLocation);

  const [region, setRegion] = useState({
    ...storeLocation,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [distance, setDistance] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  // INIT
  useEffect(() => {
    if (mode === "pickup") {
      setCoord(storeLocation);
      setLoading(false);
      return;
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      moveToLocation(loc.coords.latitude, loc.coords.longitude);
      setLoading(false);
    })();
  }, []);

  // Hitung ongkir
  const calculateShipping = (lat: number, lng: number) => {
    const d = haversine(
      storeLocation.latitude,
      storeLocation.longitude,
      lat,
      lng
    );

    const cost = Math.ceil(d * 5000);

    setDistance(d);
    setShippingCost(cost);

    if (typeof onLocationSelect === "function") {
      onLocationSelect({
        lat,
        lng,
        distance: d,
        shippingCost: cost,
      });
    }
  };

  const moveToLocation = (lat: number, lng: number) => {
    setCoord({ latitude: lat, longitude: lng });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    if (mode === "delivery") calculateShipping(lat, lng);
  };

  const handleDragEnd = (e: any) => {
    if (mode === "pickup") return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    moveToLocation(latitude, longitude);
  };

  const goToCurrentLocation = async () => {
    if (mode === "pickup") return;
    const loc = await Location.getCurrentPositionAsync({});
    moveToLocation(loc.coords.latitude, loc.coords.longitude);
  };

  if (loading) {
    return (
      <View style={[styles.center, { height }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View>
      <View style={{ height, borderRadius: 16, overflow: "hidden" }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {mode === "delivery" && (
            <Marker coordinate={coord} draggable onDragEnd={handleDragEnd} />
          )}

          {mode === "pickup" && (
            <Marker coordinate={storeLocation} pinColor="blue" />
          )}

          <Marker coordinate={storeLocation} pinColor="blue" />
        </MapView>

        {mode === "delivery" && (
          <TouchableOpacity style={styles.gpsButton} onPress={goToCurrentLocation}>
            <Ionicons name="navigate" size={22} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {mode === "delivery" && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>📏 Jarak </Text>
          <Text style={styles.value}>{distance.toFixed(2)} km</Text>

          <Text style={styles.label}>🚚 Ongkos Kirim</Text>
          <Text style={styles.cost}>Rp {shippingCost.toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },

  gpsButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "#0077FF",
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: {
    marginTop: 10,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },

  label: { fontWeight: "bold", color: "#444" },
  value: { color: "#666" },
  cost: { fontSize: 18, fontWeight: "bold", color: "#0077FF" },
});
