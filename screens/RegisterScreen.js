import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


export default function RegisterScreen({ navigation }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');


const handleRegister = async () => {
setError('');
if (!email || !password) return setError('Please provide email and password');
try {
await createUserWithEmailAndPassword(auth, email, password);
} catch (e) {
setError(e.message);
}
};


return (
<View style={styles.container}>
<Text style={styles.title}>Create Account</Text>
{error ? <Text style={styles.error}>{error}</Text> : null}
<TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
<TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
<Button title="Register" onPress={handleRegister} />
<Text style={{marginTop:12}} onPress={() => navigation.goBack()}>Back to Login</Text>
</View>
);
}


const styles = StyleSheet.create({
container: { flex:1, padding:16, justifyContent:'center' },
title: { fontSize:24, marginBottom:16, textAlign:'center' },
input: { borderWidth:1, borderColor:'#ccc', padding:12, marginBottom:12, borderRadius:8 },
error: { color:'red', marginBottom:8 }
});