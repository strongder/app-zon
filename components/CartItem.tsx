import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getColorName } from "../utils/colorUtils";

interface CartItemProps {
  cartDetail: {
    id: number;
    cartId: number;
    quantity: number;
    productDetail: {
      id: number;
      color: string
      size: string;
      img: string;
      price: number;
    };
    productName: string;
  }, 
  onRemove: (id: number) => void
  onUpdate: (id: number, quantity: number, actionType: number) => void
  onSelect: (id: number, isSelected: boolean) => void;
}

const CartItem = ({ cartDetail, onRemove, onUpdate, onSelect }: CartItemProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = useCallback(() => {
    setIsSelected(!isSelected);
    onSelect(cartDetail.id, !isSelected);
  }, [isSelected, cartDetail.id, onSelect]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelect} style={styles.checkbox}>
        <MaterialIcons
          name={isSelected ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={isSelected ? "#007AFF" : "#000"}
        />
      </TouchableOpacity>
      <Image source={{ uri: cartDetail.productDetail.img }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{cartDetail.productName}</Text>
        <Text style={styles.classification}>
          Size: {cartDetail.productDetail.size} - {getColorName(cartDetail.productDetail.color) || cartDetail.productDetail.color}
        </Text>
        <Text style={styles.price}>{cartDetail.productDetail.price.toLocaleString('vi-VN')} VNĐ</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => onUpdate(cartDetail.id, cartDetail.quantity - 1, 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{cartDetail.quantity}</Text>
          <TouchableOpacity
            onPress={() => onUpdate(cartDetail.id, cartDetail.quantity + 1, 0)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(cartDetail.id)}
        style={styles.removeButton}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  classification: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#e91e63",
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
});

export default CartItem;
