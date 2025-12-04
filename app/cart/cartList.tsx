import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
};

type CartListProps = {
  item: CartItem;
  updateCartQuantity: (id: string, qty: number) => void;
  deleteCartItem: (id: string) => void;
};

export default function CartList({ item, updateCartQuantity, deleteCartItem }: CartListProps) {
  return (
    <View
      style={{
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
      }}
    >
      <Image source={item.image} style={{ width: 60, height: 60, borderRadius: 12, marginRight: 12 }} />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#0F3D2E" }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
          Rp {(item.price || 0).toLocaleString()}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => updateCartQuantity(item.id, item.quantity - 1)} style={{ backgroundColor: "#2f4a2f22", padding: 6, borderRadius: 10 }}>
          <Ionicons name="remove" size={18} />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, marginHorizontal: 10, fontWeight: "700", color: "#0F3D2E" }}>
          {item.quantity}
        </Text>

        <TouchableOpacity onPress={() => updateCartQuantity(item.id, item.quantity + 1)} style={{ backgroundColor: "#2f4a2f22", padding: 6, borderRadius: 10 }}>
          <Ionicons name="add" size={18} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteCartItem(item.id)} style={{ marginLeft: 14 }}>
          <Ionicons name="trash-outline" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
