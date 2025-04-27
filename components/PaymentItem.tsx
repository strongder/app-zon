import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PaymentItem = ({ payment }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Transaction ID:{" "}
        <Text style={styles.value}>{payment.transactionId}</Text>
      </Text>
      <Text style={styles.label}>
        Order Code: <Text style={styles.value}>{payment.orderCode}</Text>
      </Text>
      <Text style={styles.label}>
        Amount: <Text style={styles.value}>{payment.amount} VND</Text>
      </Text>
      <Text style={styles.label}>
        Payment Method:{" "}
        <Text style={styles.value}>{payment.paymentMethod}</Text>
      </Text>
      <Text style={styles.label}>
        Status: <Text style={styles.value}>{payment.status}</Text>
      </Text>
      <Text style={styles.label}>
        Payment Time:{" "}
        <Text style={styles.value}>
          {new Date(payment.paymentTime).toLocaleString()}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    fontWeight: "normal",
    color: "#555",
  },
});

export default PaymentItem;
