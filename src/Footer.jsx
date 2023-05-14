import { StyleSheet, Text, View } from 'react-native';

const Footer = () => {
    return <View style={styles.footer}>
            <Text style={{ color: 'grey', textAlign:'center', fontSize:10}}>@TeamConquerors</Text>
        </View>
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#2d282a',
        flex: 0.03,
        padding:7
    },
})

export default Footer;