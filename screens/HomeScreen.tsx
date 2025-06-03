import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProductItem from "../components/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import {fetchCategoryAll } from "../redux/CategorySlice";
import {
  fetchProduct,
  fetchProductByCategory,
  fetchProductByDiscount,
  fetchSuggestedProducts,
  fetchNewProducts,
} from "../redux/ProductSlice";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch = useDispatch();
  const [pageProductDiscount, setpageProductDiscount] = useState(0);
  const [pageProduct, setpageProduct] = useState(0);
  const [pageNew, setPageNew] = useState(0);
  const { categories } = useSelector((state: any) => state.categories);
  const param = {
    pageNum: 0,
  };
  const { listProduct, listDiscountProduct, suggestedProducts, newProducts } = useSelector(
    (state: any) => state.products
  );
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setData(listProduct);
  }, [listProduct]);

  useEffect(() => {
    const newParam = { ...param, pageNum: pageProduct };
    dispatch(fetchProduct({ param: newParam }));
  }, [dispatch, pageProduct]);

  useEffect(() => {
    dispatch(fetchCategoryAll());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSuggestedProducts());
  }, [dispatch]);

  useEffect(() => {
    const newParam = { ...param, pageNum: pageNew };
    dispatch(fetchNewProducts({ param: newParam }));
  }, [dispatch, pageNew]);

  const handleSearch = () => {
    navigation.navigate("SearchPage", {searchTerm});
  };

  const handleSelectCategory = async (id: number) => {
    await dispatch(fetchProductByCategory({ id: id, param: param }));
    navigation.navigate("Category");
  };
  console.log(data);

  // Thêm hàm kiểm tra dữ liệu sản phẩm
  const isValidProduct = (item: any) => {
    return item && typeof item === 'object' && item.id !== undefined;
  };

  // Thêm hàm tạo key duy nhất
  const generateUniqueKey = (item: any, index: number, prefix: string) => {
    if (!isValidProduct(item)) {
      return `${prefix}-invalid-${index}`;
    }
    return `${prefix}-${item.id}-${index}`;
  };

  const renderProductList = (title: string, data: any, setPage: any, prefix: string) => {
    const validData = Array.isArray(data) ? data.filter(isValidProduct) : [];
    
    if (validData.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          key={'grid'}
          scrollEnabled={false}
          data={validData}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: item.id })
              }
              style={styles.productItem}
            >
              <ProductItem product={item} />
            </Pressable>
          )}
          keyExtractor={(item, index) => generateUniqueKey(item, index, prefix)}
          showsHorizontalScrollIndicator={false}
          numColumns={2}
        />
        <Pressable onPress={() => setPage((prev: any) => prev + 1)}>
          <Text>Xem thêm</Text>
        </Pressable>
      </View>
    );
  };

  const renderHorizontalProductList = (title: string, data: any, prefix: string) => {
    const validData = Array.isArray(data) ? data.filter(isValidProduct) : [];
    
    if (validData.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <FlatList
          key={'horizontal-' + prefix}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={validData}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: item.id })
              }
              style={styles.horizontalProductItem}
            >
              <View style={styles.horizontalProductContainer}>
                <Image
                  source={{ uri: item.img }}
                  style={styles.horizontalProductImage}
                />
                <View style={styles.horizontalProductInfo}>
                  <Text style={styles.horizontalProductName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.horizontalProductPrice}>
                    {item.priceRange?.toLocaleString('vi-VN')} VNĐ
                  </Text>
                  <Text style={styles.horizontalProductRating}>
                    {item.star ? `⭐ ${item.star}` : 'Chưa có đánh giá'}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => generateUniqueKey(item, index, prefix)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <Pressable onPress={handleSearch}>
            <Ionicons name="search" size={24} color="black" />
          </Pressable>
        </View>

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://colour.vn/wp-content/uploads/mau-banner-quang-cao-khuyen-mai.jpg",
            }}
            style={styles.bannerImage}
          />
        </View>

        <View style={styles.section}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <Text
              style={{ alignItems: "center" }}
              onPress={()=>handleSelectCategory(categories[0]?.id)}
            >
              Chi tiết
              <AntDesign name="right" size={18} color="black" />
            </Text>
          </View>
          {categories && Array.isArray(categories) && (
            <FlatList
              horizontal
              scrollEnabled={true}
              data={categories}
              renderItem={({ item, index }) => (
                <Pressable
                  style={styles.categoryItem}
                  onPress={() => handleSelectCategory(item?.id)}
                >
                  <View style={{ alignItems: "center", gap: 20 }}>
                    <Image
                      source={{ uri: item?.img }}
                      style={{ width: 80, height: 80, borderRadius: 50 }}
                    />
                    <Text style={styles.categoryText}>{item?.name}</Text>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item, index) => `category-${item?.id || index}`}
              showsHorizontalScrollIndicator={true}
            />
          )}
        </View>

        {suggestedProducts && suggestedProducts.length > 0 && 
          renderHorizontalProductList("Sản phẩm gợi ý cho bạn", suggestedProducts, 'suggested')
        }

        {newProducts && newProducts.length > 0 && 
          renderHorizontalProductList("Sản phẩm mới", newProducts, 'new')
        }

        {listProduct && renderProductList("Tất cả sản phẩm", data, setpageProduct, 'all')}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 50,
    backgroundColor: "#f7f7f7",
  },
  listProduct: {},
  productItem: {
    width: "47%",
    margin: 5, // Thêm khoảng cách 10 giữa các sản phẩm (5 cho mỗi bên)
  },
  searchContainer: {
    backgroundColor: "#00CED1",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 40,
    flex: 1,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  searchInput: {
     height: 40,
    flex: 1,
  },
  
  bannerContainer: {
    padding: 10,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryItem: {
    padding: 10,
    backgroundColor: "#AFEEEE",
    borderRadius: 5,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
  horizontalProductItem: {
    width: 200,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalProductContainer: {
    padding: 10,
  },
  horizontalProductImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  horizontalProductInfo: {
    padding: 5,
  },
  horizontalProductName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  horizontalProductPrice: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '600',
    marginBottom: 4,
  },
  horizontalProductRating: {
    fontSize: 12,
    color: '#666',
  },
});