import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import ImageSlider from 'react-native-image-slider';

// Giả sử bạn có một mảng images
const { width: viewportWidth } = Dimensions.get('window');

// Component ImageSlider
const SlideImage = ({ listImagesProduct }:any) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageSlider
        images={listImagesProduct}
        height={200}
        customSlide={({ index, item }:any) => (
          <View key = {index} style={{ justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri: item }} style={{ width: viewportWidth, height: 200 }} />
          </View>
        )}
      />
    </View>
  );
};

export default SlideImage;
