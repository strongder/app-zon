import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ProductItem from "../components/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductBySearch, fetchProductBySearchExtend } from "../redux/ProductSlice";
import { Picker } from "@react-native-picker/picker";

// Define interfaces to match backend
interface ProductFilterRequest {
  procedureIds?: number[];
  categoryIds?: number[];
  name?: string;
  priceBigger?: number;
  priceLower?: number;
  role?: string;
  page?: number;
  size?: number;
}

const SearchScreen = ({ navigation, route }: any) => {
  const searchTermFromRoute = route.params?.searchTerm || "";

  // State variables to match backend filter requirements
  const [searchTerm, setSearchTerm] = useState<string>(searchTermFromRoute);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [results, setResults] = useState<any>([]);

  // Filter states matching backend
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [procedureIds, setProcedureIds] = useState<number[]>([]);
  const [priceLower, setPriceLower] = useState<number | null>(null);
  const [priceBigger, setPriceBigger] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // UI states
  const [showPriceModal, setShowPriceModal] = useState<boolean>(false);
  const [tempPriceLower, setTempPriceLower] = useState<number | null>(null);
  const [tempPriceBigger, setTempPriceBigger] = useState<number | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  const dispatch = useDispatch();
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const suppliers = [
    // Danh sách nhà cung cấp, ví dụ:
    { id: 1, name: "Nhà cung cấp A" },
    { id: 2, name: "Nhà cung cấp B" },
    { id: 3, name: "Nhà cung cấp C" },
  ];
  // Sample categories - replace with your actual categories from API
  const categories = useSelector((state: any) => state.categories.categories);
  const procedures = useSelector((state: any) => state.categories.procedures);

  // Create filter request matching backend requirements
  const createFilterRequest = (): ProductFilterRequest => {
    const request: ProductFilterRequest = {
      page,
      size,
    };

    if (searchTerm) request.name = searchTerm;
    if (categoryIds.length > 0) request.categoryIds = categoryIds;
    if (procedureIds.length > 0) request.procedureIds = procedureIds;
    if (priceBigger !== null) request.priceBigger = priceBigger;
    if (priceLower !== null) request.priceLower = priceLower;
    if (role) request.role = role;

    return request;
  };

  useEffect(() => {
    handleSearchProduct();
  }, [dispatch, page]);

  // Effect to reset and search when filters change
  useEffect(() => {
    if (page === 0) {
      handleSearchProduct();
    } else {
      setPage(0);
      setResults([]);
    }
  }, [searchTerm, categoryIds, procedureIds, priceBigger, priceLower, role]);

  const handleSearchProduct = async () => {
    if (!loading && hasMore) {
      setLoading(true);

      const filterRequest = createFilterRequest();
      console.log("Sending request:", filterRequest);

      try {
        const action = await dispatch(fetchProductBySearchExtend(filterRequest));

        if (fetchProductBySearchExtend.fulfilled.match(action)) {
          const payload = action.payload;

          if (!payload || payload.length === 0) {
            setHasMore(false);
          }

          if (page === 0) {
            setResults(payload || []);
          } else {
            setResults((prev: any) => {
              const existingIds = new Set(prev.map((item: any) => item.id));
              const newItems = (payload || []).filter(
                (item: any) => !existingIds.has(item.id)
              );
              return [...prev, ...newItems];
            });
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearchPress = () => {
    if (page === 0) {
      setResults([]);
      setHasMore(true);
      handleSearchProduct();
    } else {
      setPage(0);
      setResults([]);
      setHasMore(true);
    }
  };

  const resetFilters = () => {
    setCategoryIds([]);
    setProcedureIds([]);
    setPriceLower(null);
    setPriceBigger(null);
    setRole(null);
  };

  const applyPriceFilter = () => {
    setPriceLower(tempPriceLower);
    setPriceBigger(tempPriceBigger);
    setShowPriceModal(false);
  };

  const toggleCategory = (id: number) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const toggleSupplier = (id: number) => {
    setProcedureIds((prev) =>
      prev.includes(id) ? prev.filter((proId) => proId !== id) : [...prev, id]
    );
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Get price range text for display
  const getPriceRangeText = () => {
    if (priceLower !== null && priceBigger !== null) {
      return `${formatPrice(priceLower)}đ - ${formatPrice(priceBigger)}đ`;
    } else if (priceLower !== null) {
      return `Từ ${formatPrice(priceLower)}đ`;
    } else if (priceBigger !== null) {
      return `Đến ${formatPrice(priceBigger)}đ`;
    }
    return "Giá";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={22} color="#333" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <AntDesign
              name="search1"
              size={18}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Tìm kiếm sản phẩm..."
              placeholderTextColor="#999"
              returnKeyType="search"
              onSubmitEditing={handleSearchPress}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <AntDesign name="close" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Bộ lọc</Text>
          <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
            <Text style={styles.resetText}>Đặt lại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {/* Category filter */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              categoryIds.length > 0 && styles.activeFilterButton,
            ]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text
              style={[
                styles.filterButtonText,
                categoryIds.length > 0 && styles.activeFilterText,
              ]}
            >
              {categoryIds.length > 0
                ? `Danh mục (${categoryIds.length})`
                : "Danh mục"}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color={categoryIds.length > 0 ? "#FF6B00" : "#555"}
            />
          </TouchableOpacity>
          {/* provider filter */}

          <TouchableOpacity
            style={[
              styles.filterButton,
              procedureIds.length > 0 && styles.activeFilterButton,
            ]}
            onPress={() => setShowSupplierModal(true)}
          >
            <Text
              style={[
                styles.filterButtonText,
                procedureIds.length > 0 && styles.activeFilterText,
              ]}
            >
              {procedureIds.length > 0
                ? `Nhà cung cấp (${procedureIds.length})`
                : "Nhà cung cấp"}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color={procedureIds.length > 0 ? "#FF6B00" : "#555"}
            />
          </TouchableOpacity>
          {/* Price filter */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              (priceLower !== null || priceBigger !== null) &&
                styles.activeFilterButton,
            ]}
            onPress={() => {
              setTempPriceLower(priceLower);
              setTempPriceBigger(priceBigger);
              setShowPriceModal(true);
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                (priceLower !== null || priceBigger !== null) &&
                  styles.activeFilterText,
                styles.ellipsisText,
              ]}
              numberOfLines={1}
            >
              {priceLower !== null || priceBigger !== null
                ? getPriceRangeText()
                : "Giá"}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color={
                priceLower !== null || priceBigger !== null ? "#FF6B00" : "#555"
              }
            />
          </TouchableOpacity>

          {/* Sort button */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              // Toggle sort order logic here
            }}
          >
            <Text style={styles.filterButtonText}>Sắp xếp</Text>
            <Ionicons name="swap-vertical" size={18} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Results count */}
        {results.length > 0 && (
          <Text style={styles.resultsCount}>
            Tìm thấy {results.length} sản phẩm
          </Text>
        )}

        {/* Product list */}
        {results.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <AntDesign name="inbox" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
            <Text style={styles.emptySubtext}>
              Hãy thử tìm kiếm với từ khóa khác
            </Text>
          </View>
        ) : (
          <FlatList
        scrollEnabled={false}
        data={results}
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
        )}

        {/* Price Range Modal */}
        <Modal
          visible={showPriceModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPriceModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn khoảng giá</Text>
                <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                  <AntDesign name="close" size={22} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.priceInputContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceInputLabel}>Từ</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={
                      tempPriceLower !== null ? tempPriceLower.toString() : ""
                    }
                    onChangeText={(text) =>
                      setTempPriceLower(text ? parseInt(text) : null)
                    }
                    placeholder="0"
                    keyboardType="numeric"
                  />
                  <Text style={styles.priceCurrency}>đ</Text>
                </View>

                <View style={styles.priceInputDivider} />

                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceInputLabel}>Đến</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={
                      tempPriceBigger !== null ? tempPriceBigger.toString() : ""
                    }
                    onChangeText={(text) =>
                      setTempPriceBigger(text ? parseInt(text) : null)
                    }
                    placeholder="Không giới hạn"
                    keyboardType="numeric"
                  />
                  <Text style={styles.priceCurrency}>đ</Text>
                </View>
              </View>

              {/* Common price ranges */}
              <View style={styles.priceRanges}>
                <TouchableOpacity
                  style={styles.priceRangeButton}
                  onPress={() => {
                    setTempPriceLower(0);
                    setTempPriceBigger(100000);
                  }}
                >
                  <Text style={styles.priceRangeText}>Dưới 100.000đ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.priceRangeButton}
                  onPress={() => {
                    setTempPriceLower(100000);
                    setTempPriceBigger(300000);
                  }}
                >
                  <Text style={styles.priceRangeText}>100.000đ - 300.000đ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.priceRangeButton}
                  onPress={() => {
                    setTempPriceLower(300000);
                    setTempPriceBigger(500000);
                  }}
                >
                  <Text style={styles.priceRangeText}>300.000đ - 500.000đ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.priceRangeButton}
                  onPress={() => {
                    setTempPriceLower(500000);
                    setTempPriceBigger(null);
                  }}
                >
                  <Text style={styles.priceRangeText}>Trên 500.000đ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowPriceModal(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalApplyButton}
                  onPress={applyPriceFilter}
                >
                  <Text style={styles.modalApplyText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Category Modal */}
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn danh mục</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <AntDesign name="close" size={22} color="#333" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={categories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => toggleCategory(item.id)}
                  >
                    <Text style={styles.categoryName}>{item.name}</Text>
                    {categoryIds.includes(item.id) && (
                      <AntDesign name="check" size={20} color="#FF6B00" />
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowCategoryModal(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalApplyButton}
                  onPress={() => setShowCategoryModal(false)}
                >
                  <Text style={styles.modalApplyText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* // Supplier Modal */}
        <Modal
          visible={showSupplierModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSupplierModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn nhà cung cấp</Text>
                <TouchableOpacity onPress={() => setShowSupplierModal(false)}>
                  <AntDesign name="close" size={22} color="#333" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={procedures}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => toggleSupplier(item.id)}
                  >
                    <Text style={styles.categoryName}>{item.name}</Text>
                    {procedureIds.includes(item.id) && (
                      <AntDesign name="check" size={20} color="#FF6B00" />
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowSupplierModal(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalApplyButton}
                  onPress={() => setShowSupplierModal(false)}
                >
                  <Text style={styles.modalApplyText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: 46,
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resetButton: {
    padding: 4,
  },
  resetText: {
    color: "#FF6B00",
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
    height: 42,
  },
  activeFilterButton: {
    backgroundColor: "#FFF0E6",
    borderWidth: 1,
    borderColor: "#FF6B00",
  },
  filterButtonText: {
    color: "#555",
    fontWeight: "500",
    fontSize: 13,
  },
  activeFilterText: {
    color: "#FF6B00",
  },
  ellipsisText: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  productItem: {
    margin: 5,
    width: "47%",
  },
  list: {
    paddingBottom: 20,
  },
  loaderContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  priceCurrency: {
    position: "absolute",
    right: 12,
    top: 38,
    color: "#666",
  },
  priceInputDivider: {
    width: 20,
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
    marginTop: 20,
  },
  priceRanges: {
    marginTop: 24,
  },
  priceRangeButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceRangeText: {
    fontSize: 15,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    marginLeft: 8,
  },
  modalApplyText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryName: {
    fontSize: 15,
    color: "#333",
  },
});

export default SearchScreen;
