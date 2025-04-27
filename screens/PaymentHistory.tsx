import React, { useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import PaymentItem from "../components/PaymentItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayment } from "../redux/PaymentSlice";

const PaymentHistory: React.FC = () => {
  const dispatch = useDispatch();
  const {payments} = useSelector((state: any) => state.payments);
  const currentUser = useSelector((state: any) => state.users.currentUser);

  useEffect(() => {
    dispatch(fetchPayment(currentUser.id));
  }, [dispatch, currentUser]);

  const renderItem = ({ item }: any) => <PaymentItem payment={item} />;

  return (
    <View style={styles.container}>
      {payments && (
        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id?.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default PaymentHistory;
