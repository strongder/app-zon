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
} from "../redux/ProductSlice";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch = useDispatch();
  const [pageProductDiscount, setpageProductDiscount] = useState(0);
  const [pageProduct, setpageProduct] = useState(0);
  const { categories } = useSelector((state: any) => state.categories);
  const param = {
    pageNum: 0,
  };
  const { listProduct, listDiscountProduct } = useSelector(
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

  const handleSearch = () => {
    navigation.navigate("SearchPage", {searchTerm});
  };

  const handleSelectCategory = async (id: number) => {
    await dispatch(fetchProductByCategory({ id: id, param: param }));
    navigation.navigate("Category");
  };
  console.log(data);
  const renderProductList = (title: string, data: any, setPage: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: item.id })
            }
            style={styles.productItem}
          >
            <ProductItem product={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id + ""}
        showsHorizontalScrollIndicator={false}
        numColumns={2}
      />
      <Pressable onPress={() => setPage((prev: any) => prev + 1)}>
        <Text>Xem thêm</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <Pressable style={styles.searchBox}>
            <AntDesign
              style={styles.searchIcon}
              name="search1"
              size={24}
              color="black"
            />
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
            />
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
          {categories && (
            <FlatList
              horizontal
              scrollEnabled={true}
              data={categories}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.categoryItem}
                  onPress={() => handleSelectCategory(item?.id)}
                >
                  <View style={{ alignItems: "center", gap: 20 }}>
                    <Image
                      source={{ uri: item?.img }}
                      style={{ width: 80, height: 80, borderRadius: 50 }}
                    ></Image>
                    <Text style={styles.categoryText}>{item?.name}</Text>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item.id + ""}
              showsHorizontalScrollIndicator={true}
            />
          )}
        </View>
        {listProduct &&
          renderProductList("Sản phẩm", data, setpageProduct)}
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
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
});