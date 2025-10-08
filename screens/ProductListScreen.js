import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';


export default function ProductListScreen({ navigation }) {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);


const fetchProducts = async (category = null) => {
setLoading(true);
setError(null);
try {
const url = category ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}` : 'https://fakestoreapi.com/products';
const res = await axios.get(url);
setProducts(res.data);
} catch (e) {
setError('Failed to fetch products');
} finally {
setLoading(false);
}
};


const fetchCategories = async () => {
try {
const res = await axios.get('https://fakestoreapi.com/products/categories');
setCategories(res.data);
} catch (e) {
// ignore
}
};


useEffect(() => { fetchCategories(); fetchProducts(); }, []);


useEffect(() => { fetchProducts(selectedCategory); }, [selectedCategory]);


if (loading) return <ActivityIndicator style={{flex:1}} size="large" />;
if (error) return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>{error}</Text></View>;


return (
<View style={{flex:1}}>
<CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
<FlatList data={products} keyExtractor={(item) => String(item.id)} renderItem={({item}) => (
<ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { product: item })} />
)} contentContainerStyle={{padding:12}} />
</View>
);
}