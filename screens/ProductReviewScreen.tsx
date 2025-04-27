import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  fetchReviewByUserAndProduct,
} from "../redux/ReviewSlice";
import { useNavigation } from "@react-navigation/native";

const ProductReviewScreen = ({ route }: any) => {
  const { orderItem } = route.params;
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const { review } = useSelector((state: any) => state.reviews);
  const navigation: any = useNavigation();

  const [type, setType] = useState("create");
  const dispatch = useDispatch();
  const [reviewData, setReviewData] = useState<any>({
    productId: orderItem.varProduct.productId,
    rating: 0,
    comment: "",
    userId: currentUser.id,
  });
  // Lấy review nếu đã có
  useEffect(() => {
    if (currentUser?.id && orderItem?.varProduct?.productId) {
      dispatch(
        fetchReviewByUserAndProduct({
          userId: currentUser.id,
          productId: orderItem.varProduct.productId,
        })
      );
    }
  }, [dispatch, currentUser.id, orderItem.varProduct.productId]);

  // Nếu đã có review, cập nhật vào reviewData
  useEffect(() => {
    if (review) {
      setReviewData({
        productId: orderItem.varProduct.productId,
        rating: review.rating || 0,
        comment: review.comment || "",
        userId: currentUser.id,
      });
      setType("update"); // Nếu đã có review thì cập nhật
    }
  }, [review]);

  // Hàm cập nhật số sao được chọn
  const handleRating = (star: number) => {
    
    setReviewData({ ...reviewData, rating: star });
  };

  // Hàm xử lý gửi đánh giá
  const handleSubmit = () => {
    console.log(reviewData);
    dispatch(createReview(reviewData));
    navigation.navigate("ProductDetail", { productId: orderItem.varProduct.productId });
  };

  return (
    <View style={styles.container}>
      {/* Ảnh và thông tin sản phẩm */}
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: orderItem.image }} />
        <Text style={styles.productName}>{orderItem.name}</Text>
        <Text style={styles.productCategory}>
          {Object.values(orderItem.varProduct.attribute).join(",")}
        </Text>
      </View>

      {/* Đánh giá sao */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Đánh giá sản phẩm:</Text>
        <View style={styles.starContainer}>
          {Array.from({ length: 5 }, (_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleRating(index + 1)}
            >
              <FontAwesome
                name={index < reviewData.rating ? "star" : "star-o"}
                size={32}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bình luận */}
      <TextInput
        style={styles.commentInput}
        placeholder="Viết bình luận của bạn..."
        value={reviewData.comment}
        onChangeText={(value) =>
          setReviewData({ ...reviewData, comment: value })
        }
        multiline
      />

      {/* Nút gửi hoặc cập nhật */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {type === "create" ? "Gửi đánh giá" : "Cập nhật đánh giá"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  header: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 16,
    color: "#666",
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
  },
  commentInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top", // Đưa nội dung nhập lên trên cùng khi multiline
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
