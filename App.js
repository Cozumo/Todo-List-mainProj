import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, View, SectionList } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Header  from './src/Header.jsx';
import Footer from  './src/Footer.jsx';
import Content from  './src/Content.jsx';


export default function App() {
  return (
      <View style={styles.container}>
        
        <Header/>

        <Content/>
        
        <Footer/>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});