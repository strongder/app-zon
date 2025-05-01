import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ReviewItem = ({review}: any) => {
  console.log("ReviewItem render", review);

  const generateRating: any= (rating: number) => {
    let result = '';
    for (let i = 0; i < rating; i++) {
      result += '★';
    }
    return result;
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: review?.user?.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{review?.user?.username}</Text>
        <Text style={styles.rating}>Đánh giá: {generateRating(review?.rate)}</Text>
        <Text style={styles.description}>{review?.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Bố trí các thành phần theo hàng ngang
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Bóng cho Android
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Hình tròn
    marginRight: 10,
  },
  content: {
    flex: 1, // Chiếm đầy không gian còn lại
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    color: '#f39c12',
    marginVertical: 5,
  },
  description: {
    color: '#333',
  },
});

export default ReviewItem;
