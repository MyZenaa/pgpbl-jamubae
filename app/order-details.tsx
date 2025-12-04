import { useLocalSearchParams, useRouter } from "expo-router";
import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { realtimeDB } from "./firebaseConfig";

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const orderRef = ref(realtimeDB, `orders/${id}`);
    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>Memuat detail pesanan...</Text>
      </View>
    );
  }

  const grandTotal =
    (order.subtotal || 0) + (order.delivery?.shippingCost || 0);

  const updateStatus = (newStatus: string) => {
    update(ref(realtimeDB, `orders/${id}`), { status: newStatus });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Detail Pesanan</Text>

      {/* Nama */}
      <View style={styles.card}>
        <Text style={styles.label}>Nama Pemesan</Text>
        <Text style={styles.value}>{order.name}</Text>
      </View>

      {/* Mode */}
      <View style={styles.card}>
        <Text style={styles.label}>Metode Pemesanan</Text>
        <Text style={styles.value}>
          {order.mode === "delivery" ? "Diantar" : "Pickup di Toko"}
        </Text>
      </View>

      {/* Delivery */}
      {order.mode === "delivery" && (
        <View style={styles.card}>
          <Text style={styles.label}>Alamat Pengantaran</Text>
          <Text style={styles.value}>{order.delivery?.address}</Text>

          <Text style={[styles.value, { marginTop: 6 }]}>
            Ongkos Kirim:
            <Text style={styles.boldText}>
              {" "}Rp {(order.delivery?.shippingCost || 0).toLocaleString()}
            </Text>
          </Text>
        </View>
      )}

      {/* ITEM LIST */}
      <View style={styles.card}>
        <Text style={styles.label}>Item Pesanan</Text>

        {/* items disimpan sebagai cart[] */}
        {order.cart?.map((item: any, i: number) => (
          <View key={i} style={styles.row}>
            <Text style={styles.value}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.value}>
              Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Subtotal */}
        <View style={styles.row}>
          <Text style={styles.boldText}>Subtotal</Text>
          <Text style={styles.boldText}>
            Rp {(order.subtotal || 0).toLocaleString()}
          </Text>
        </View>

        {/* Grand Total */}
        <View style={styles.row}>
          <Text style={styles.boldText}>Total Akhir</Text>
          <Text style={styles.boldText}>
            Rp {grandTotal.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Catatan */}
      {order.note && (
        <View style={styles.card}>
          <Text style={styles.label}>Catatan Tambahan</Text>
          <Text style={styles.value}>{order.note}</Text>
        </View>
      )}

      {/* STATUS */}
      <View style={styles.card}>
        <Text style={styles.label}>Status Pesanan</Text>
        <Text style={styles.status}>{order.status || "Menunggu"}</Text>

        <View style={{ marginTop: 14 }}>
          {order.status === "Menunggu" && (
            <TouchableOpacity
              style={styles.statusBtn}
              onPress={() => updateStatus("Diproses")}
            >
              <Text style={styles.statusBtnText}>Set Diproses</Text>
            </TouchableOpacity>
          )}

          {order.status === "Diproses" && (
            <TouchableOpacity
              style={styles.statusBtn}
              onPress={() => updateStatus("Dikirim")}
            >
              <Text style={styles.statusBtnText}>Set Dikirim</Text>
            </TouchableOpacity>
          )}

          {order.status === "Dikirim" && (
            <TouchableOpacity
              style={styles.statusBtn}
              onPress={() => updateStatus("Selesai")}
            >
              <Text style={styles.statusBtnText}>Set Selesai</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Edit */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push(`/edit-order?id=${id}`)}
      >
        <Text style={styles.editText}>Edit Pesanan</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#F4EED8",
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F3D2E",
    marginBottom: 18,
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#0F3D2E",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  label: {
    fontSize: 14,
    color: "#1A1A1A",
    opacity: 0.65,
    marginBottom: 5,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  boldText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F3D2E",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  divider: {
    height: 1.3,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  status: {
    fontSize: 17,
    fontWeight: "700",
    color: "#88A47C",
    marginBottom: 8,
  },

  statusBtn: {
    backgroundColor: "#0F3D2E",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },

  statusBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },

  editBtn: {
    backgroundColor: "#D9A441",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  editText: {
    color: "#0F3D2E",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },

  backBtn: {
    marginTop: 14,
    backgroundColor: "#E0D8BD",
    padding: 14,
    borderRadius: 12,
  },

  backText: {
    textAlign: "center",
    color: "#0F3D2E",
    fontSize: 16,
    fontWeight: "700",
  },
});
