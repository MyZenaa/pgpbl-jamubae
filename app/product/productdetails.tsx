import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { assets } from "@/constants/data";
import cartService from "../cart/cartService"; // FIXED IMPORT

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const product = useMemo(
    () => assets.recommendedJamu.find((item) => item.id === id),
    [id]
  );

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  // FIXED — pakai cartService.add()
  const handleAddToCart = () => {
    cartService.add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    Alert.alert("Berhasil", "Produk berhasil ditambahkan ke keranjang!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("../cartscreen");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f6ef" }}>
      {/* HEADER IMAGE */}
      <View style={styles.headerContainer}>
        <Image source={product.image} style={styles.productImage} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* TITLE */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.titleWrap}
        >
          <Text style={styles.title}>{product.name.toUpperCase()}</Text>
        </Animated.View>

        {/* PRICE */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.priceWrap}
        >
          <Text style={styles.price}>
            Rp {(product.price || 0).toLocaleString("id-ID")}
          </Text>

          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={18} color="#ffb800" />
            <FontAwesome name="star" size={18} color="#ffb800" />
            <FontAwesome name="star" size={18} color="#ffb800" />
            <FontAwesome name="star" size={18} color="#ffb800" />
            <FontAwesome
              name={product.rating % 1 >= 0.5 ? "star-half-full" : "star-o"}
              size={18}
              color="#ffb800"
            />
            <Text style={{ marginLeft: 6, fontWeight: "600" }}>
              ({product.rating})
            </Text>
          </View>

          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Stock Tersedia</Text>
          </View>
        </Animated.View>

        {/* INGREDIENTS */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>BAHAN UTAMA</Text>
          <Text style={styles.sectionText}>{product.ingredients}</Text>
        </Animated.View>

        {/* DESCRIPTION */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>MANFAAT</Text>
          <Text style={styles.sectionText}>{product.description}</Text>
        </Animated.View>

        {/* BENEFITS */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>MANFAAT</Text>
          <Text style={styles.bullet}>• Meningkatkan daya tahan tubuh</Text>
          <Text style={styles.bullet}>• Menjaga pencernaan</Text>
          <Text style={styles.bullet}>• Kaya antioksidan</Text>
          <Text style={styles.bullet}>• Membantu pemulihan stamina</Text>
        </Animated.View>

        {/* C A R A   P E N Y A J I A N */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>CARA PENYAJIAN</Text>
          <Text style={styles.bullet}>
            1. Kocok terlebih dahulu sebelum diminum
          </Text>
          <Text style={styles.bullet}>2. Sajikan dingin atau hangat</Text>
          <Text style={styles.bullet}>3. Minum 1–2 kali sehari</Text>
        </Animated.View>

        {/* KHASIAT */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
          <Text style={styles.sectionTitle}>KHASIAT UTAMA</Text>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Antioksidan</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "85%" }]} />
            </View>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Meningkatkan Imun</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "70%" }]} />
            </View>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Menyehatkan Pencernaan</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "90%" }]} />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Masukan Keranjang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyText}>Beli Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerContainer: {
    width: "100%",
    height: 260,
    backgroundColor: "#e6e2d3",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  productImage: { width: 180, height: 180, borderRadius: 28 },

  titleWrap: { alignItems: "center", marginTop: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#2f4a2f" },

  priceWrap: { alignItems: "center", marginTop: 10 },
  price: { fontSize: 26, fontWeight: "700", color: "#333" },

  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },

  stockBadge: {
    marginTop: 12,
    backgroundColor: "#2f4a2f",
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 20,
  },
  stockText: { color: "#fff", fontWeight: "600" },

  section: { paddingHorizontal: 20, marginTop: 22 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2f4a2f" },
  sectionText: { marginTop: 6, fontSize: 15, color: "#444" },
  bullet: { fontSize: 15, color: "#444", marginTop: 4 },

  progressItem: { marginTop: 12 },
  progressLabel: { fontSize: 14, fontWeight: "600", color: "#333" },

  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2f4a2f",
    borderRadius: 10,
  },

  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffffdd",
    padding: 20,
    flexDirection: "row",
    gap: 14,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  cartBtn: {
    flex: 1,
    backgroundColor: "#2f4a2f22",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buyBtn: {
    flex: 1,
    backgroundColor: "#2f4a2f",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  cartText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2f4a2f",
    textAlign: "center", // <-- tambah ini
  },

  buyText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    textAlign: "center", // <-- tambah ini
  },
});
