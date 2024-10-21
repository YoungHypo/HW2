import {Text, TextInput, View, StyleSheet, Button, ScrollView} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCVLLKMev1u0QoWW2OOHWyIi061GZl2Goo",
  authDomain: "homework2-71174.firebaseapp.com",
  projectId: "homework2-71174",
  storageBucket: "homework2-71174.appspot.com",
  messagingSenderId: "360929074111",
  appId: "1:360929074111:web:5def0961e726c89e355f0a",
  measurementId: "G-5Q4ZWF6J54"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({email, setEmail, password, setPassword, isLoggingIn, setIsLoggingIn, handleAuthentication, handleGoogleButtonPress}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sublet!</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />

        <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
        />

        <View style={styles.buttonContainer}>
            <Button
                title={isLoggingIn ? 'Sign In' : 'Sign Up'}
                onPress={handleAuthentication} 
                color="#3678da"
            />
        </View>

        <View style={styles.bottomContainer}>
            <Text style={styles.toggleText} onPress={() => setIsLoggingIn(!isLoggingIn)}>
                {isLoggingIn ? 'Create an account' : 'Already have an account?'}
            </Text>
        </View>

        <View style={styles.bottomContainer}>
            <Button
                title="Sign in with Google"
                onPress={handleGoogleButtonPress}
                color="#3678da"
            />
        </View>
    </View>
  );
}

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(true);
    const [user, setUser] = useState(null);

    const _auth = getAuth(app);
    useEffect(() => {
        const unsubscribe = _auth.onAuthStateChanged(user => setUser(user));
        return unsubscribe;
    }, [_auth]);

    const handleGoogleButtonPress = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken, user } = await GoogleSignin.signIn();
        console.log(user);
    
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }

    const handleAuthentication = async () => {
        try {
            if (user) {
                console.log('Signing out');
                await signOut(_auth);
            }
            else {
                if (isLoggingIn) { // Sign in
                    await signInWithEmailAndPassword(_auth, email, password);
                    console.log('Signed in');
                }
                else { // Sign up
                    await createUserWithEmailAndPassword(_auth, email, password);
                    console.log('Signed up');
                }
            }
        }
        catch (error) {
            console.error(error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user ? (
                <View style={styles.authContainer}>
                    <Text style={styles.title}>Welcome, {user.email}!</Text>
                    <Button title="Sign Out" onPress={handleAuthentication} />
                </View>
            ) : (
                <AuthScreen
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    isLoggingIn={isLoggingIn}
                    setIsLoggingIn={setIsLoggingIn}
                    handleAuthentication={handleAuthentication}
                    handleGoogleButtonPress={handleGoogleButtonPress}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 24,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  toggleText: {
    color: '#3678da',
    textAlign: 'center',
    fontSize: 14,
  }
});