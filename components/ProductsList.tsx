import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setProducts, addToCart, removeFromCart } from '../redux/productSlice';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductList = () => {
  const dispatch = useDispatch();
  const products: Product[] = useSelector((state: any) => state.product.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({ id: selectedProduct.id }));
    }
  };

  const renderStars = (rating: number, count: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <Text key={index} style={index < Math.round(rating) ? styles.starFilled : styles.starEmpty}>
            ★
          </Text>
        ))}
        <Text style={styles.ratingCount}> ({count})</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedProduct(item);
        setModalVisible(true);
      }}
      style={styles.itemWrapper}
    >
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {renderStars(item.rating.rate, item.rating.count)}
          <Text style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</Text>
          <Text style={{ fontSize: 16 }}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.shopping}>Shopping</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        {selectedProduct && (
          <View style={styles.modalContainer}>
            <View style={styles.card}>
              <Image
                source={{ uri: selectedProduct.image }}
                style={styles.image}
              />
              <View style={{flexDirection:'row',width:250,marginRight:55,marginTop:15}}>
              <Text style={{fontWeight:'bold',color:'black',fontSize:18}}>Description : </Text>
              <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={[styles.buttonText,{color:'black'}]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  shopping: {
    backgroundColor: 'skyblue',
    height: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 8,
    fontSize: 20,
    color: 'black'
  },
  itemWrapper: {
    margin: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    height:165
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 20,
    color: 'black',
  },
  itemPrice: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starFilled: {
    color: 'gold',
    fontSize: 20,
  },
  starEmpty: {
    color: '#ddd',
    fontSize: 16,
  },
  ratingCount: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  modalDescription: {
    fontSize: 20,
    textAlign: 'justify',
    marginVertical: 10,
    marginLeft: 5,
    marginRight: 35,
    fontWeight: 'bold',
    marginTop:0,
    color:'black'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain', 
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  addButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: 'silver',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});


export default ProductList;
