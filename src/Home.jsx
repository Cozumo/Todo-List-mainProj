import { Button, Pressable, StyleSheet, Text, View, SectionList } from 'react-native';
import Header  from './Header.jsx';
import Footer from  './Footer.jsx';
import Content from  './Content.jsx';


export default Home = ({navigation}) => {


    return <View style={styles.container}>
        
        <Header/>
        
        <Content navigation={navigation}/>
        
        <Footer/>
    
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
  });

