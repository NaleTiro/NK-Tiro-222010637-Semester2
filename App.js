import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AppNavigator from './navigation/AppNavigator';


export default function App() {
const [initializing, setInitializing] = useState(true);
const [user, setUser] = useState(null);


useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (usr) => {
setUser(usr);
if (initializing) setInitializing(false);
});
return unsubscribe;
}, []);


if (initializing) {
return (
<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
<ActivityIndicator size="large" />
</View>
);
}


return (
<NavigationContainer>
<AppNavigator user={user} />
</NavigationContainer>
);
}
