import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ReviewItem from "../components/ReviewItem";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, fetchCart } from "../redux/CartSlice";
import Modal from "react-native-modal";
import { fetchReviewByProduct } from "../redux/ReviewSlice";
import { fetchProductById } from "../redux/ProductSlice";
import SlideImage from "../components/SlideImage";

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const product = useSelector((state: any) => state.products.product);
  const reviews = useSelector((state: any) => state.reviews.reviews);

  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState();

  // Lấy thông tin size, color và classification
  const classifications = product?.productDetailResponseList?.map(
    (varProduct: any) => ({
      id: varProduct.id,
      color: varProduct.color,
      size: varProduct.size,
      img: varProduct.img,
      price: varProduct.price,
      availableQuantity: varProduct.quantity,
    })
  );

  const listColor = classifications?.map(
    (classification: any) => classification.color
  );
  //lấy size theo màu đã chọn
  const filteredClassifications = classifications?.filter(
    (classification: any) => classification.color === selectedColor
  );

  useEffect(() => {
    setSelectedColor(listColor?.[0]);
    setSelectedSize(filteredClassifications?.[0]?.size);
  }, [selectedColor]);

  // Mở modal khi cần
  const openModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId));
    // Fetch reviews when the page changes
    const newParam = { pageNum: currentReviewPage };
    if (product?.id) {
      dispatch(
        fetchReviewByProduct({ productId: product.id, param: newParam })
      );
    }
  }, [dispatch, productId, currentReviewPage]);

  // viet ham set san pham duoc chon sau khi chon color va size
  const handleAddProductToCard = () => {
    const selectedClassification = filteredClassifications?.find(
      (item: any) => item.size === selectedSize
    );
    if (selectedClassification) {
      const param = {
        productDetailId: selectedClassification.id,
        quantity: quantity,
        actionType: 0,
      };
      dispatch(addProductToCart({ param }))
        .then(() => {
          // Gọi fetchCart sau khi thêm sản phẩm vào giỏ hàng
          dispatch(fetchCart());
          setIsModalVisible(false);
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error("Error adding product to cart:", error);
        });
    }
  };

  const listImagesProduct = product?.productDetailResponseList?.map(
    (item: any) => item.img
  );
  const handleMoreReview = () => {
    setCurrentReviewPage((prev) => prev + 1);
  };

  // Xử lý thay đổi số lượng (tăng/giảm)
  const handleQuantityChange = (value: number) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <>
      {product && (
        <ScrollView style={styles.container}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              marginBottom: 10,
            }}
          >
            {product.productDetailResponseList && (
              <SlideImage listImagesProduct={listImagesProduct} />
            )}
          </View>
          <Text style={styles.title}>{product.name}</Text>

          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text style={styles.price}>
              {product?.priceRange?.toLocaleString("de-DE")} VNĐ
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>Đánh giá: {product.star} / 5</Text>
            <Image
              source={{
                uri:
                  "https://media.doisongvietnam.vn/u/tungseo/uploads/2016/09/cach-ve-ngoi-sao-19-9-2016-2.jpg",
              }}
              style={{ width: 25, height: 25, marginLeft: 5 }}
            ></Image>
          </View>

          <Text style={styles.stock}>Đã bán: {product.quantitySold}</Text>
          <Pressable style={styles.addCart} onPress={openModal}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Thêm vào giỏ hàng
            </Text>
          </Pressable>

          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setIsModalVisible(false)}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: 300,
              }}
            >
              {/* Hình ảnh sản phẩm */}
              <Image
                source={{ uri: filteredClassifications?.[0]?.img }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
              />
              {/* Chọn Màu */}
              <View style={{ marginTop: 15 }}>
                <Text style={{ fontWeight: "bold" }}>Chọn Màu</Text>
                <Picker
                  selectedValue={selectedColor}
                  onValueChange={setSelectedColor}
                  style={{ height: 50 }}
                >
                  {listColor?.map((item: any, index: any) => (
                    <Picker.Item key={index} label={item} value={item} />
                  ))}
                </Picker>
              </View>
              {/* Chọn Size */}
              <View style={{ marginTop: 15 }}>
                <Text style={{ fontWeight: "bold" }}>Chọn Size</Text>
                <Picker
                  selectedValue={selectedSize}
                  onValueChange={setSelectedSize}
                  style={{ height: 50 }}
                >
                  {filteredClassifications?.map((item: any, index: any) => (
                    <Picker.Item
                      key={index}
                      label={item.size}
                      value={item.size}
                    />
                  ))}
                </Picker>
              </View>

              {/* Số lượng */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Số Lượng</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(quantity - 1)}
                  >
                    <Text style={{ fontSize: 20, marginHorizontal: 10 }}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      width: 40,
                      textAlign: "center",
                      borderBottomWidth: 1,
                      marginHorizontal: 10,
                    }}
                    keyboardType="numeric"
                    value={String(quantity)}
                    onChangeText={(text) => setQuantity(Number(text))}
                  />
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(quantity + 1)}
                  >
                    <Text style={{ fontSize: 20, marginHorizontal: 10 }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Thêm vào giỏ hàng */}
              <View style={{ marginTop: 20 }}>
                <Button
                  title="Thêm vào giỏ hàng"
                  onPress={() => handleAddProductToCard()}
                />
              </View>
            </View>
          </Modal>

          <View style={styles.description}>
            <Text style={styles.descriptionTitle}>Mô tả</Text>
            <Text
              style={
                isDescriptionExpanded
                  ? styles.descriptionContentActive
                  : styles.descriptionContent
              }
            >
              {product?.description?.replace(/<[^>]+>/g, "")}
            </Text>
            <Button
              title={isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            />
          </View>
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Đánh giá</Text>
            {reviews && (
              <FlatList
                data={reviews}
                contentContainerStyle={styles.listReview}
                renderItem={({ item }) => <ReviewItem review={item} />}
                keyExtractor={(item: any) => item?.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
            <Pressable onPress={handleMoreReview}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  paddingVertical: 5,
                  paddingBottom: 20,
                }}
              >
                Xem thêm
              </Text>
            </Pressable>
          </View>

          {/* <View style={styles.relatedProductsSection}>
            <Text style={styles.relatedProductsTitle}>Related Products</Text>
          </View> */}
        </ScrollView>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%", // Chiếm toàn bộ chiều rộng của View
    height: "100%", // Chiếm toàn bộ chiều cao của View
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  addCart: {
    backgroundColor: "#f39c12",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginVertical: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e60023",
  },
  discount: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "line-through",
    color: "red",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: "#000",
  },
  stock: {
    fontSize: 16,
    color: "#000",
    marginVertical: 0,
  },
  pickerContainer: {
    marginVertical: 10,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
  },
  commentSection: {
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  descriptionContent: {
    color: "black",
    marginVertical: 16,
    height: 50,
  },
  descriptionContentActive: {
    color: "black",
    marginVertical: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  relatedProductsSection: {
    marginVertical: 16,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  relatedProduct: {
    marginRight: 10,
    alignItems: "center",
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 60,
    textAlign: "center",
    borderRadius: 5,
  },
  listReview: {
    flexDirection: "column",
    width: "100%",
  },
});

export default ProductDetailScreen;
