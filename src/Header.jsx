import { StyleSheet, Text, View } from 'react-native';

export default Header = () => {


    return <View style={styles.header}>
            <Text>
              <Text style={{ color: 'white', textAlign:'left', fontSize:30, marginRight: 20}}>Todo List</Text>
            </Text>
        </View>
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: '#2d282a',
    flex: 0.07,
    padding:20,
    paddingTop:60,
    paddingBottom:2,
    borderBottomColor: '#474a48',
    borderBottomWidth: 1, 
  },
})