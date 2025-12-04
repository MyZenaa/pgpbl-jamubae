// Updated ProductScreen UI FINAL FIX (Palette 1, Modern, Clean)

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { assets } from "@/constants/data";
import { useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";

const PALETTE = {
  primary: "#0F3D2E",
  sage: "#88A47C",
  turmeric: "#D9A441",
  cream: "#F4EED8",
  black: "#1A1A1A",
};

const RatingStars = ({ rating = 0 }: { rating?: number }) => {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <View style={styles.starsContainer}>
      {[...Array(full)].map((_, i) => (
        <FontAwesome key={i} name="star" size={14} color="#FFD700" />
      ))}
      {hasHalf && <FontAwesome name="star-half-empty" size={14} color="#FFD700" />}
    </View>
  );
};

const ProductScreen = () => {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const filteredProducts = useMemo(() => {
    let products = [...assets.recommendedJamu];
    if (category !== "all") products = products.filter((p) => p.category === category);
    if (search.trim().length > 0)
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (sort === "low") products.sort((a, b) => a.price - b.price);
    if (sort === "high") products.sort((a, b) => b.price - a.price);
    if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    return products;
  }, [category, search, sort]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/product/productdetails",
          params: {
            id: item.id,
            name: item.name,
            price: item.price,
            rating: item.rating,
            description: item.description,
            ingredients: JSON.stringify(item.ingredients),
            image: Image.resolveAssetSource(item.image).uri,
            category: item.category,
          },
        })
      }
    >
      {/* IMAGE — SQUARE FIXED */}
      <Image source={item.image} style={styles.image} />

      {/* RIGHT CONTENT */}
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>

          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <FontAwesome
              name={favorites.includes(item.id) ? "heart" : "heart-o"}
              size={20}
              color={favorites.includes(item.id) ? PALETTE.turmeric : PALETTE.primary}
            />
          </TouchableOpacity>
        </View>

        {/* DESCRIPTION SHORT — UPDATED */}
        <ThemedText style={styles.description} numberOfLines={2}>
          {item.description}
        </ThemedText>

        {/* INGREDIENTS SHORT — UPDATED */}
        <ThemedText style={styles.ingredients} numberOfLines={1}>
          • {item.ingredients.join(", ")}
        </ThemedText>

        <ThemedText style={styles.price}>
          Rp {item.price.toLocaleString("id-ID")}
        </ThemedText>

        <RatingStars rating={item.rating} />

        <View style={styles.stockBadge}>
          <ThemedText style={styles.stockText}>Stock Tersedia</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>MENU JAMU</ThemedText>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Cari jamu..."
        placeholderTextColor={PALETTE.primary}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* TAB */}
      <View style={styles.tabBar}>
        {["all", "kesehatan", "kecantikan", "stamina"].map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)}>
            <ThemedText style={[styles.tab, category === cat && styles.tabActive]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* SORT PICKER */}
      <Picker selectedValue={sort} onValueChange={setSort} style={styles.picker}>
        <Picker.Item label="Urutkan" value="none" />
        <Picker.Item label="Harga Terendah" value="low" />
        <Picker.Item label="Harga Tertinggi" value="high" />
        <Picker.Item label="Rating Tertinggi" value="rating" />
      </Picker>

      {/* LIST */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </ThemedView>
  );
};

export default ProductScreen;

/* =======================
     UPDATED STYLES
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.cream,
  },

  header: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 18,
    paddingTop: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  search: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.sage,
    color: PALETTE.black,
    elevation: 3,
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: PALETTE.cream,
  },
  tab: {
    fontSize: 16,
    color: PALETTE.black,
    opacity: 0.6,
  },
  tabActive: {
    color: PALETTE.primary,
    opacity: 1,
    fontWeight: "700",
    borderBottomWidth: 2,
    borderColor: PALETTE.primary,
    paddingBottom: 4,
  },

  picker: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    color: PALETTE.black,
  },

  listContainer: {
    padding: 12,
  },

  /* CARD — FULLY UPDATED */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    borderWidth: 1,
    borderColor: PALETTE.sage,

    // NEW LOOK — more rectangular & elegant
    padding: 10,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 12, // square but soft
  },

  cardContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "center",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: PALETTE.primary,
    maxWidth: "80%",
  },

  description: {
    fontSize: 12,
    color: PALETTE.black,
    opacity: 0.7,
    marginTop: 2,
  },

  ingredients: {
    fontSize: 11,
    color: PALETTE.black,
    opacity: 0.6,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
    color: PALETTE.primary,
  },

  starsContainer: {
    flexDirection: "row",
    marginTop: 2,
  },

  stockBadge: {
    backgroundColor: PALETTE.sage,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },

  stockText: {
    color: PALETTE.black,
    fontSize: 11,
  },
});
