import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View, SectionList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { setUser } from "./Content.jsx";

export default Login = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");

    function handleRegister(){
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, username, pass)
        .then((userCredential) => {
            setUser(userCredential.user);
            console.log("Registered User");
            navigation.navigate('Home');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    }

    function handleLogin(){
        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, pass)
          .then((userCredential) => {
            setUser(userCredential.user);
            console.log("Logged User");
            navigation.navigate('Home');
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
          });
    }

    return <View style={styles.loginPage}>
        <Text style={styles.Heading} >TODO LIST</Text>

        <TextInput
            label={"Enter Username"}
            value={username}
            style={styles.inputStyle}
            onChangeText={username => setUsername(username)}
      />

        <TextInput
            label={"Enter Password"}
            value={pass}
            style={styles.inputStyle}
            onChangeText={pass => setPass(pass)}
      />
    
        <Pressable style={styles.logbuttonStyle} onPress={handleLogin}>
            <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Login</Text>
        </Pressable>
        <Pressable style={styles.regbuttonStyle} onPress={handleRegister}>
            <Text style={{ color: '#476a64', textAlign:'center', fontSize: 20}}>Register</Text>
        </Pressable>

    </View>
}

const styles = StyleSheet.create({
    loginPage: {
        flex: 1,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: '50%'
    },
    Heading: {
        color: '#476a64',
        textAlign: 'center',
        fontSize: 30,
        margin: 20
    },
    inputStyle: {
        marginTop: 30,
    },
    logbuttonStyle: {
        marginTop: 30,
        backgroundColor: '#476a64',
        padding: 10,
        borderRadius: 20,
    },
    regbuttonStyle: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        borderColor: '#476a64',
        borderStyle: 'solid',
        borderWidth: 1,
    }
  });