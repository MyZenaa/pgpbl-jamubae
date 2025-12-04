import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // ANIMATION
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.emoji}>🌿</Text>

        <Text style={styles.title}>Pesanan Berhasil!</Text>

        <Text style={styles.subtitle}>
          Terima kasih! Pesanan Anda sedang diproses.
        </Text>

        <Text style={styles.label}>ID Pesanan</Text>
        <Text style={styles.orderId}>{orderId}</Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/homescreen")}
          style={styles.button}
        >
          <Text style={styles.btnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/order-details",
              params: { id: orderId },
            })
          }
          style={[styles.button, styles.secondaryBtn]}
        >
          <Text style={[styles.btnText, { color: "#0F3D2E" }]}>
            Lihat Detail Pesanan
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EED8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "white",
    width: "100%",
    padding: 28,
    borderRadius: 18,
    elevation: 6,
    shadowColor: "#0F3D2E",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: "center",
  },

  emoji: {
    fontSize: 50,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F3D2E",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#1A1A1A",
    opacity: 0.8,
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 15,
    color: "#1A1A1A",
    opacity: 0.7,
    marginTop: 4,
  },

  orderId: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F3D2E",
    marginVertical: 8,
  },

  button: {
    width: "100%",
    backgroundColor: "#0F3D2E",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#D9A441",
  },
});
