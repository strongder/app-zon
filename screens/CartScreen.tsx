// screens/CartScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CartItem from "../components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { removeProductFromCart, updateProductInCart } from "../redux/CartSlice";
import { fetchCurrentUser } from "../redux/UserSlice";
import { configAxios } from "../api";
import { getVoucherByUser } from "../redux/VoucherSlice";

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { cart }: any = useSelector((state: RootState) => state.carts);
  const [total, setTotal] = useState<number>(0);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cartDetails, setCartDetails] = useState<any[]>([]);

  const handleSelectItem = (id: number, selected: boolean) => {
    setSelectedItems((prevSelected) => {
      if (selected) {
        return [...prevSelected, id];  // Thêm item vào danh sách chọn
      } else {
        return prevSelected.filter(item => item !== id);  // Xóa item khỏi danh sách chọn
      }
    });
  };


  const currentUser: any = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const {vouchers}: any = useSelector((state: any) => state.vouchers);

  useEffect(() => {
    setCartDetails(cart?.cartDetails);
    dispatch(getVoucherByUser());
  }, [dispatch, cart]);

  useEffect(() => {
    configAxios(navigation);
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const removeItem = (id: number) => {
    const param = {
      cartItemId: id,
      userId: currentUser.id, // Đảm bảo currentUser.id có giá trị đúng
    };
    dispatch(removeProductFromCart({ param })); // Truyền param vào như đã định
  };
  const updateItem = (id: number, quantity: number, actionType: number) => {
    // Update item in cart
    const param = {
      productDetailId: id,
      quantity: quantity,
      actionType: 1,
    };
    dispatch(updateProductInCart({ param }));
    setCartDetails((prev) =>
      prev.map((item) =>
        item.productDetail.id === id
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };
  const getFinalTotal = () => {
    let total = 0;
    cartDetails
      ?.filter((item:any) => selectedItems.includes(item.id))
      .forEach((item: any) => {
        total += item.productDetail.price * item.quantity;
      });
  
    if (!selectedVoucher) return total;
  
    if(selectedVoucher?.value * total < selectedVoucher?.maxMoney) {
      // Giảm theo phần trăm (ví dụ 0.1 là 10%)
      return total - total * selectedVoucher?.value;
    } else {
      // Giảm theo số tiền
      return Math.max(0, total - selectedVoucher?.maxMoney);
    }
  };
  
  useEffect(() => {
    setTotal(getFinalTotal());
  }, [cartDetails, selectedVoucher]);
  const handleCheckout = () => {
    navigation.navigate("Checkout", { cartDetailIds: selectedItems, price: getFinalTotal(), voucherId: selectedVoucher?.id });
  };


  return (
    <View style={styles.container}>
      {cart && (
        <>
          <FlatList
            data={cartDetails}
            renderItem={({ item }) => (
              <CartItem
                cartDetail={item}
                onRemove={removeItem}
                onUpdate={updateItem}
                onSelect={handleSelectItem}  // Truyền hàm chọn vào đây
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            style={{ flexGrow: 0 }}
            ListFooterComponent={
              <View style={styles.voucherContainer}>
                <Text style={styles.voucherLabel}>Chọn voucher:</Text>
                {vouchers?.map((voucher:any) => (
                  <TouchableOpacity
                    key={voucher.id}
                    style={[
                      styles.voucherButton,
                      selectedVoucher?.id === voucher.id &&
                        styles.voucherSelected,
                    ]}
                    onPress={() => setSelectedVoucher(voucher)}
                  >
                    <Text>{voucher?.code} - {voucher?.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />

          {/* Cố định phần tổng tiền + thanh toán bên dưới */}
          <View style={styles.footerFixed}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Tổng cộng: {getFinalTotal().toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Tiến hành thanh toán
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  voucherContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  voucherLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  voucherButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  voucherSelected: {
    backgroundColor: "#d1f7d6",
    borderColor: "#4caf50",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 16,
  },
  quantity: {
    fontSize: 18,
    paddingHorizontal: 16,
  },
  removeButton: {
    color: "red",
    marginTop: 8,
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
