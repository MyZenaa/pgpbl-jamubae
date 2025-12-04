import React from "react";
import { View, StyleSheet, Image, Platform, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function PickupMap({ height = 200 }) {
  const storeLocation = {
    latitude: -7.771055,
    longitude: 110.384504,
  };

  return (
    <View style={[styles.container, { height }]}>

      {/* Map Wrapper (Android Fix) */}
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            ...storeLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker coordinate={storeLocation}>
            <Image
              source={require("@/assets/images/store.png")}
              style={styles.storeIcon}
            />
          </Marker>
        </MapView>
      </View>

      {/* LABEL TOKO */}
      <View style={styles.labelContainer}>
        <Image
          source={require("@/assets/images/store.png")}
          style={styles.smallIcon}
        />

        <View style={{ marginLeft: 8 }}>
          <Text style={styles.title}>Toko Jamu Sehat Sentosa</Text>
          <Text style={styles.subtitle}>
            Jl. Kaliurang No. 123, Yogyakarta
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: Platform.OS === "ios" ? "hidden" : "visible",
    backgroundColor: "#fff",
    elevation: 2,
  },

  map: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  storeIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },

  smallIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    color: "#666",
    fontSize: 12,
  },
});
