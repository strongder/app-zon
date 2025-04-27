import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AddressItem = ({item}: any) => {
  return (
    <View style={styles.addressDetails}>
          <Text style={styles.recipientName}>
            Tên người nhận: {item.recipientName}
          </Text>
          <Text>Số điện thoại: {item.phone}</Text>
          <Text>Tỉnh/Thành phố: {item.city}</Text>
          <Text>Quận/Huyện: {item.district}</Text>
          <Text>Phường/Xã: {item.ward}</Text>
          <Text>Địa chỉ chi tiết: {item.addressDetail}</Text>
        </View>
  )
}

export default AddressItem

const styles = StyleSheet.create({

    addressDetails: {
        marginBottom: 10,
      },
      recipientName: {
        fontWeight: "bold",
        fontSize: 16,
      },
})