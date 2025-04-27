import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getColorNameFromRGB } from "./getColorNameFromRGB";
import { MaterialIcons } from "@expo/vector-icons";

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
  onSelect: (id: number, isSelected: boolean) => void;  // Hàm callback để thông báo trạng thái chọn
}
const CartItem: React.FC<CartItemProps> = ({ cartDetail, onRemove, onUpdate, onSelect }) => {
  const [quantity, setQuantity] = useState<number>(cartDetail.quantity);
  const [isSelected, setIsSelected] = useState<boolean>(false);  // Trạng 
  // Callback để tăng số lượng
  const increaseQuantity = useCallback(() => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdate(cartDetail.productDetail.id, newQuantity, 1);
  }, [quantity, cartDetail.productDetail.id, onUpdate]);
  

  // Callback để giảm số lượng
  const decreaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity > 1) {
        const newQuantity = prevQuantity - 1;
        onUpdate(cartDetail.productDetail.id, newQuantity, 1);
        return newQuantity;
      }
      return prevQuantity;
    });
  }, [cartDetail.productDetail.id, onUpdate]);


  // Cập nhật lại số lượng khi cartDetail thay đổi
  useEffect(() => {
    setQuantity(cartDetail.quantity);
  }, [cartDetail.quantity]);

  const handleSelect = () => {
    setIsSelected((prevState) => {
      const newSelectedState = !prevState;
      onSelect(cartDetail.id, newSelectedState);  // Gọi hàm onSelect để thông báo bên ngoài
      return newSelectedState;
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelect} style={styles.selectContainer}>
        <MaterialIcons
          name={isSelected ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <Image source={{ uri: cartDetail?.productDetail?.img }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{cartDetail.productName}</Text>
        <Text style={styles.classification}>{cartDetail?.productDetail.size}-{cartDetail?.productDetail?.color}</Text>
        <Text style={styles.price}>
          {cartDetail?.productDetail?.price.toLocaleString("de-DE")} VNĐ
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(cartDetail.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 14,
    color: "#e91e63",
  },
  classification: {
    fontSize: 14,
    color: "black",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#ff5252",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
  },
});

export default CartItem;
