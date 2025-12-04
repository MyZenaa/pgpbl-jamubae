import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Menentukan warna background tab menjadi hijau
        tabBarStyle: {
          backgroundColor: "#0F3D2E", // Hijau untuk background
        },
        // Menentukan warna ikon aktif menjadi warna lebih terang (misalnya #F4EED8)
        tabBarActiveTintColor: "#F4EED8", // Warna ikon aktif
        // Menentukan warna ikon non-aktif
        tabBarInactiveTintColor: "#D9D9D9", // Misalnya warna abu-abu muda untuk ikon tidak aktif
        headerShown: false,
        tabBarButton: HapticTab, // Menggunakan custom tab button dengan haptic feedback
      }}
    >
      <Tabs.Screen
        name="homescreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapscreen"
        options={{
          title: "Maps",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="map-marked-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="productscreen"
        options={{
          title: "Product",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="shopping-bag" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cartscreen"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="shopping-cart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
