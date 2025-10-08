import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs() {
return (
<Tab.Navigator>
<Tab.Screen name="Products" component={ProductListScreen} />
<Tab.Screen name="Cart" component={CartScreen} />
</Tab.Navigator>
);
}


export default function AppNavigator({ user }) {
return (
<Stack.Navigator screenOptions={{ headerShown: true }}>
{user ? (
<>
<Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
<Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Detail' }} />
</>
) : (
<>
<Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
<Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
</>
)}
</Stack.Navigator>
);
}