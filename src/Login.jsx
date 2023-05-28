import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View, SectionList } from 'react-native';
import { TextInput } from 'react-native-paper';

export default Login = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");

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
    
        <Pressable style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
            <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Login</Text>
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
    buttonStyle: {
        marginTop: 30,
        backgroundColor: '#476a64',
        padding: 10,
        borderRadius: 20,
    }
  });