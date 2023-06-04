import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import { TextInput } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { setUser } from "./Content.jsx";


//handle user registration while sending data to firebase
const handleRegister = (username, pass, navigation) => {
    if(validateEmail(username)){
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
            Alert.alert(errorCode, errorMessage, [ { text: 'Ok', style: 'Ok', } ], { cancelable: true } );
        });
    }
    else{
        Alert.alert("Wrong Email Format", "Email not Correct!", [ { text: 'Ok', style: 'Ok', } ], { cancelable: true } );
    }
}


//handle user Login while sending data to firebase
const handleLogin = (username, pass, navigation) => {
    if(validateEmail(username)){
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
            Alert.alert(errorCode, errorMessage, [ { text: 'Ok', style: 'Ok', } ], { cancelable: true } );
          });
    }
    else{
        Alert.alert("Wrong Email Format", "Email not Correct!", [ { text: 'Ok', style: 'Ok', } ], { cancelable: true } );
    }
}

const emailValidationRegex = "^[0-9A-Za-z._+]+@[A-Za-z0-9]+.[A-Za-z0-9]+$";    


const validateEmail = (email) => {
    return email.match(emailValidationRegex);
}


export default Login = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");


    return <View style={styles.loginPage}>
        <Text style={styles.Heading} >TODO LIST</Text>

        <TextInput
            label={"Enter Email"}
            value={username}
            style={styles.inputStyle}
            onChangeText={username => setUsername(username)}
      />

        <TextInput
            label={"Enter Password"}
            secureTextEntry={true}
            value={pass}
            style={styles.inputStyle}
            onChangeText={pass => setPass(pass)}
      />
    
        {/* Login Button */}
        <Pressable style={({ pressed }) => [{opacity:pressed ? 0.85 : 1. } , styles.logbuttonStyle ]} onPress={() => handleLogin(username, pass, navigation)}>
            <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Login</Text>
        </Pressable>

        {/* Register Button */}
        <Pressable style={({ pressed }) => [{opacity:pressed ? 0.85 : 1. } , styles.regbuttonStyle ]} onPress={() => handleRegister(username, pass, navigation)}>
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