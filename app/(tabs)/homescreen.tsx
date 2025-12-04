// app/(tabs)/homescreen.tsx
import { ThemedText } from "@/components/themed-text";
import { assets } from "@/constants/data";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

// 🎨 PALETTE 1 — Modern Natural Elegance
const PALETTE = {
  primary: "#0F3D2E",
  secondary: "#88A47C",
  accent: "#D9A441",
  background: "#F4EED8",
  text: "#1A1A1A",
};

type Jamu = {
  id: string;
  name: string;
  image: any;
  price: number;
  rating: number;
  category: string;
  description?: string;
  ingredients?: string[] | string;
};

const categories = ["all", "kesehatan", "stamina", "kecantikan", "detox"];

export default function HomeScreen() {
  const router = useRouter();

  // Theme override dengan palette
  const backgroundColor = useThemeColor({}, "background") ?? PALETTE.background;
  const cardColor = "#ffffff";
  const textColor = useThemeColor({}, "text") ?? PALETTE.text;
  const accentColor = PALETTE.primary;
  const iconColor = useThemeColor({}, "icon") ?? PALETTE.secondary;

  const allProducts: Jamu[] = assets.recommendedJamu;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);

  const promoData = [assets.promoImage];
  const promoRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (promoIndex + 1) % promoData.length;
      setPromoIndex(next);
      promoRef.current?.scrollTo({ x: next * (width - 40), animated: true });
    }, 4000);
    return () => clearInterval(id);
  }, [promoIndex]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }
    const s = allProducts
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 6)
      .map((p) => p.name);

    setSuggestions(s);
    setSuggestionsVisible(s.length > 0);
  }, [searchQuery]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategory === "all") return allProducts;
    return allProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const filteredSearch = useMemo(() => {
    if (!searchQuery) return filteredByCategory;
    return filteredByCategory.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, filteredByCategory]);

  const topRated = useMemo(() => {
    return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [allProducts]);

  const goToProduct = (item: Jamu) => {
    router.push({
      pathname: "/product/productdetails",
      params: {
        id: item.id,
        name: item.name,
        price: item.price,
        rating: item.rating,
        description: item.description ?? "",
        ingredients: JSON.stringify(item.ingredients ?? []),
        image: Image.resolveAssetSource(item.image).uri,
        category: item.category,
      },
    });
  };

  const addToCart = () => setCartCount((c) => c + 1);

  const SmallCard = ({ item }: { item: Jamu }) => (
    <Animatable.View animation="fadeInUp" duration={450} style={{ marginRight: 14 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.productCard, { backgroundColor: cardColor }]}
        onPress={() => goToProduct(item)}
      >
        <Image source={item.image} style={styles.productThumbnail} />
        <Text numberOfLines={1} style={[styles.productName, { color: textColor }]}>
          {item.name}
        </Text>

        <View style={styles.rowCenter}>
          <FontAwesome name="star" size={12} color={PALETTE.accent} />
          <Text style={[styles.smallText]}>{item.rating}</Text>
        </View>

        <Text style={[styles.priceText, { color: PALETTE.accent }]}>
          Rp{item.price.toLocaleString()}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <Animatable.View
          animation="fadeInDown"
          duration={600}
          style={[styles.hero, { backgroundColor: PALETTE.primary }]}
        >
          <View style={{ flex: 1 }}>
            <ThemedText type="title" style={styles.heroTitle}>
              Jamu Bae
            </ThemedText>
            <ThemedText type="subtitle" style={styles.heroSubtitle}>
              Asmara Hancur, Beras Kencur Meluncur
            </ThemedText>
          </View>

          <TouchableOpacity style={[styles.heroButton]} onPress={() => router.push("/productscreen")}>
            <Text style={{ color: PALETTE.primary, fontWeight: "700" }}>Lihat Menu</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* SEARCH */}
        <Animatable.View animation="fadeInUp" delay={120} style={[styles.searchRow, { backgroundColor: cardColor }]}>
          <FontAwesome name="search" size={18} color={iconColor} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Cari jamu, misal: Kunyit"
            placeholderTextColor={iconColor}
            style={[styles.searchInput, { color: textColor }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(""); setSuggestionsVisible(false); }}>
              <FontAwesome name="close" size={16} color={iconColor} />
            </TouchableOpacity>
          )}
        </Animatable.View>

        {/* SUGGESTIONS */}
        {suggestionsVisible && (
          <Animatable.View animation="fadeIn" style={[styles.suggestContainer, { backgroundColor: cardColor }]}>
            {suggestions.map((s) => (
              <TouchableOpacity key={s} style={styles.suggestItem} onPress={() => { setSearchQuery(s); setSuggestionsVisible(false); }}>
                <Text style={{ color: textColor }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </Animatable.View>
        )}

        {/* CATEGORIES */}
        <View style={styles.chipsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => {
              const active = cat === selectedCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.chip,
                    { borderColor: PALETTE.secondary },
                    active && {
                      backgroundColor: PALETTE.primary,
                      borderColor: PALETTE.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? "#fff" : PALETTE.text },
                    ]}
                  >
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* PROMO */}
        <View style={styles.promoWrap}>
        <ScrollView
            horizontal
            pagingEnabled
            ref={(r) => { promoRef.current = r; }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {promoData.map((img, idx) => (
              <TouchableOpacity key={idx}>
                <Image source={img} style={styles.promoImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* REKOMENDASI */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: PALETTE.primary }]}>
            Rekomendasi Untukmu
          </Text>
          <Text style={styles.viewAll}>Lihat Semua</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginBottom: 12 }}>
          {filteredSearch.slice(0, 8).map((p) => (
            <SmallCard key={p.id} item={p} />
          ))}
        </ScrollView>

        {/* TOP RATED */}
        <View style={[styles.sectionHeader, { paddingHorizontal: 20 }]}>
          <Text style={[styles.sectionTitle, { color: PALETTE.primary }]}>Top Rated</Text>
          <Text style={styles.subText}>Produk populer</Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20 }}>
          {topRated.map((item, idx) => (
            <Animatable.View key={item.id} animation="fadeInUp" delay={idx * 60} style={{ width: (width - 60) / 2, marginBottom: 14, marginRight: idx % 2 === 0 ? 10 : 0 }}>
              <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardColor }]} onPress={() => goToProduct(item)}>
                <Image source={item.image} style={styles.gridImage} />
                <View style={{ padding: 10 }}>
                  <Text numberOfLines={1} style={[styles.gridName, { color: textColor }]}>
                    {item.name}
                  </Text>

                  <View style={styles.rowCenter}>
                    <FontAwesome name="star" size={12} color={PALETTE.accent} />
                    <Text style={[styles.smallText]}>{item.rating}</Text>
                  </View>

                  <Text style={[styles.smallPrice, { color: PALETTE.accent }]}>
                    Rp{(item.price || 0).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingBottom: 20 },

  hero: {
    margin: 20,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroTitle: { fontSize: 20, fontWeight: "800", color: "#fff", marginBottom: 6 },
  heroSubtitle: { color: "#fff" },

  heroButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  suggestContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },

  suggestItem: {
    paddingVertical: 8,
  },

  chipsRow: {
    marginTop: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },

  chipText: { fontWeight: "700", fontSize: 12 },

  promoWrap: {
    marginTop: 6,
    marginBottom: 14,
  },

  promoImage: {
    width: width - 40,
    height: 150,
    borderRadius: 14,
    marginHorizontal: 10,
  },

  productCard: {
    width: 140,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },

  productThumbnail: {
    width: 88,
    height: 88,
    borderRadius: 10,
    marginBottom: 10,
  },

  productName: { fontWeight: "700", fontSize: 14 },

  rowCenter: { flexDirection: "row", alignItems: "center" },

  smallText: { fontSize: 12, color: PALETTE.text },

  priceText: { fontSize: 13, fontWeight: "700" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  viewAll: { color: PALETTE.secondary },

  subText: { color: PALETTE.secondary },

  gridCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },

  gridImage: {
    width: "100%",
    height: 110,
  },

  gridName: {
    fontWeight: "700",
    fontSize: 14,
  },

  smallPrice: {
    marginTop: 6,
    fontWeight: "700",
  },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#e53935",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
