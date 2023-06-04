import { useState, useEffect, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SectionList, TextInput, TouchableOpacity  } from 'react-native';
import { RadioButton, IconButton, Menu, Divider, Provider} from 'react-native-paper';

import * as Clipboard from 'expo-clipboard';

import { FirebaseDB } from '../firebaseConfig.js';
import { doc, addDoc, collection, onSnapshot, updateDoc , deleteDoc, getDoc} from 'firebase/firestore';


let user = "";    //refers to logged user


//set logged user to access his/her id for data insertion
export function setUser(newUser){    
  user = newUser;
  console.log(user.uid);
}


const Content = ({navigation}) => {

  user = { 'uid': "VhqyvfdiiSYknoMY3UV3ikskBFD3" };
  const [checkList , setcheckList] = useState([]);    //Selected Items using Radio button
  const [visible, setMenuVisibility] = useState(false);      //Visibility toggle of menu
  const [listof, setlistof] = useState(0);             //id task where new list item is being pushed
  
  const [listmodal, setlistmodalvisible] = useState(false);            //toggle state for add to list menu
  const [modalvisible, setmodalvisible] = useState(false);            //toggle state of add task menu
  const [editmodalvisible, seteditmodalvisible] = useState(false);            //toggle state of edit todo menu
  const [text, setText] = useState("");                               //textbox input state 


  //Section list managing todos
  const [sectionData, setsectionData] = useState([{ "type": "Pending", "data":[] }, { "type": "Done", "data":[] }, { "type": "\n\n", "data":[] }]);
  
  
  //Component to set data into section list
  const setData = (Tasks) => {
    
    const frData = [{ "type": "Pending", "data":[] }, { "type": "Done", "data":[] }, { "type": "\n\n", "data":[] }]; 
    Tasks.map(element => {
      if(element.iscompleted === true){
        frData[1].data.push(element);
      }else{
        frData[0].data.push(element);
      }
    });
    setsectionData([...frData]);
  }


  //Calling collection and storing todos into section list where user id matches
  useEffect(()=> {
    const todoRef = collection(FirebaseDB, `todos`);
    const subscriber = onSnapshot( todoRef, {
      next: (snapshot) => {
        const Tasks = [];

        snapshot.docs.forEach((doc) => {
          if(doc.data().userid == user.uid){
            Tasks.push({
              id: doc.id,
              ...doc.data(),
            })
          }
        });
        setData(Tasks);
      }
    });
    return () => subscriber();
  }, []);


  //Component to to set iscompleted: bool to true of individual todos
  const setComplete = async()=>{
    console.log(checkList);
    checkList.map(element => {
      const ref = doc(FirebaseDB, `todos/${element}`);
      updateDoc(ref, {iscompleted: true})
    });
    setcheckList([]);
  }


  //Component to set iscompleted: bool to false of individual todos
  const setIncomplete = async()=>{
    console.log(checkList);
    checkList.map(element => {
      const ref = doc(FirebaseDB, `todos/${element}`);
      updateDoc(ref, {iscompleted: false})
    });
    setcheckList([]);
  }


  //Component to delete document from todos firestore
  const deleteTask = async()=>{
    console.log(checkList);
    checkList.map(element => {
      const ref = doc(FirebaseDB, `todos/${element}`);
      deleteDoc(ref)
    });
    setcheckList([]);
  }


  //function to handle radiobutton taps of each todo
  function checkradio(item){
    if(checkList.includes(item.id))
      setcheckList(checkList.filter((x) => x !== item.id));
    else
      setcheckList([...checkList ,item.id])
  }


  //delete item from list of a todo
  const delListItem = async (item, el) => {       
    console.log("Delete List Item");

    const ref = doc(FirebaseDB, `todos/${item.id}`);
    newlist = (await getDoc(ref)).data().list;
    const id = newlist.indexOf(el);
    console.log(newlist.splice(id, 1));
    updateDoc(ref, {list: newlist})
  }


  //handle logout
  function handlelogout(){
    setUser("");
    navigation.navigate('Login');
  }


  //add to list modal view of each todo
  function openListmodal(id){
    setlistof(id);
    setlistmodalvisible(true);
    console.log(listof);
  }


  function openEditmodal(id){
    setlistof(id);
    seteditmodalvisible(true);
    console.log(listof);
  }


  //Function to add todo
  const handleAddTodo = async () => {
    console.log("Add Data");
    setmodalvisible(false);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = String(today.getFullYear());
    const dateToday = dd+'/'+mm+'/'+yyyy;

    const doc = addDoc(collection(FirebaseDB, 'todos'), {message: text, iscompleted: false, date: dateToday, list: [], userid: String(user.uid) })
    setText("");
  }

  
  //Function to add an item into a list
  const handleAddList = async () => {       
    console.log("Add to List");
    setlistmodalvisible(false);
    const ref = doc(FirebaseDB, `todos/${listof}`);
    newlist = (await getDoc(ref)).data().list;
    newlist.push(text);
    updateDoc(ref, {list: newlist})
    setText("");
  }


  //Component to handle edit event for each todo
  const handleEditTodo = async () => {
    console.log("Edit Data");
    seteditmodalvisible(false);
    const ref = doc(FirebaseDB, `todos/${listof}`);
    newMessage = text;
    updateDoc(ref, {message: newMessage});
    setText("");
  }


  //copy to clipboard function
  const copyToClipboard = async (item) => {
    await Clipboard.setStringAsync(item.message + "\n" + item.list.map(el => "-\t" + el + "\n"));
  };
  

  //rendering section header of section list
  const renderTaskHeader = ({section}) => {
    return (<Text style={styles.sectionHeader}>{ section.type}</Text>)
  }

  
  //rendering section list
  const renderTaskModel = ({item}) => {
    return (
      <Pressable onPress={() => {openEditmodal(item.id)}} onLongPress={() => copyToClipboard(item)} style={({ pressed }) => [{opacity:pressed ? 0.8 : 1}]}>
        <View style={styles.task}>
          <Text style={{width: '5%'}}><RadioButton color='white'  style={{width: 3}} status={checkList.includes(item.id) ? 'checked' : 'unchecked'} value={item.id} onPress={() => {checkradio(item)}}/></Text> 
          <Text style={ item.iscompleted ? styles.taskcompleted : styles.taskincompleted }>{item.message}</Text>
          <Text><IconButton style={{}} icon='plus' iconColor='white' size={20} onPress={() => ( openListmodal(item.id))}/></Text>
          
          {/* Rendering list of a todo */}
          {item.list.map(element => 
            <View style={{width: '97%', flexDirection:'row', flexWrap:'wrap', justifyContent: 'space-between'}}>
              <Text style={ item.iscompleted ? styles.listcompleted : styles.listincompleted}>➥  {element}</Text>
              <Text><IconButton style={{}} icon='delete' iconColor='white' size={20} onPress={() => (delListItem(item, element))}/></Text>
            </View>
          ) }          
          
          {/* Rendering date of todo */}
          <Text style={styles.datestyle}>{item.date}</Text>
        </View>
      </Pressable>
    )
  }


  //Main Component for Content Page
  return <View style={styles.mainContainer}>

    {/*Settings Menu to perform basic functions on individual todo*/}
    <View style={styles.iconStyle}>
      <IconButton style={{position:'relative', right:-100}} icon='dots-vertical' iconColor='white' size={20} onPress={() => setMenuVisibility(true)} />
      <Provider>
        <Menu 
          visible={visible}
          overlayAccessibilityLabel={'Close menu'}
          onDismiss={() => setMenuVisibility(false)}
          anchor={{x: 0, y: 20}}>
          <Menu.Item onPress={() => {setComplete()}} title="Mark Complete" />
          <Divider/>
          <Menu.Item onPress={() => {setIncomplete()}} title="Mark InComplete" />
          <Divider/>
          <Menu.Item onPress={() => {deleteTask()}} title="Delete" />
          <Divider/>
          <Menu.Item onPress={() => {handlelogout()}} title="Logout" />
        </Menu>
      </Provider>
    </View>


    {/*Rendering section list*/}
    <SectionList
      sections={sectionData}
      renderItem={renderTaskModel}
      renderSectionHeader={renderTaskHeader}
    />

    {/*List Modal which ask user to add an item into list of selected todo*/}
    {editmodalvisible &&
    <View style={styles.addMenu}>
      <IconButton style={{marginLeft: '90%', marginBottom: 10}} icon='close' iconColor='white' size={20} onPress={() => (seteditmodalvisible(false))}/>
      <TextInput
        placeholder={"Enter new Todo"}
        placeholderTextColor="white"
        value={text}
        style={styles.textBoxTask}
        onChangeText={text => setText(text)}
      />

      {/* Add to List Btn */}
      <Pressable style={({ pressed }) => [{opacity:pressed ? 0.5 : 1. } , styles.addTask] } onPress={handleEditTodo} >
        <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Edit</Text>
      </Pressable>
    </View>}


    {/*List Modal which ask user to add an item into list of selected todo*/}
    {listmodal &&
    <View style={styles.addMenu}>
      <IconButton style={{marginLeft: '90%', marginBottom: 10}} icon='close' iconColor='white' size={20} onPress={() => (setlistmodalvisible(false))}/>
      <TextInput
        placeholder={"Enter List Item"}
        placeholderTextColor="white"
        value={text}
        style={styles.textBoxTask}
        onChangeText={text => setText(text)}
      />

      {/* Add to List Btn */}
      <Pressable style={({ pressed }) => [{opacity:pressed ? 0.5 : 1. } , styles.addTask] } onPress={handleAddList} >
        <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Add To List</Text>
      </Pressable>
    </View>}


    {/*todo Modal which ask user to insert a new todo */}
    {modalvisible &&
    <View style={styles.addMenu}>
      <IconButton style={{marginLeft: '90%', marginBottom: 10}} icon='close' iconColor='white' size={20} onPress={() => (setmodalvisible(false))}/>
      <TextInput
        placeholder={"Enter Task"}
        placeholderTextColor="white"
        value={text}
        style={styles.textBoxTask}
        onChangeText={text => setText(text)}
      />

      {/* Add Task Btn */}
      <Pressable style={({ pressed }) => [{opacity:pressed ? 0.5 : 1. } , styles.addTask] } onPress={handleAddTodo}>
        <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Add Task</Text>
      </Pressable>
    </View>}


    {/*Add button to summon todo Modal */}
    <Pressable style={({ pressed }) => [{opacity:pressed ? 0.5 : 1 } , styles.button]} onPress={() => (setmodalvisible(true))}>
      <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>+</Text>
    </Pressable>
  </View>
}


// Content StyleSheet
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#2d282a',
        flex: 0.90,
        paddingBottom: 10
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        elevation: 3,
        backgroundColor: '#58857d',
        padding: 5,
        width: '16%',
        height: '9%',
        position: 'absolute',
        top: '80%',
        left: '77%',
        borderColor: '#527570',
        borderWidth: 1,
      },
      task: {
        backgroundColor: '#58857d',
        margin: 20,
        marginTop: 30,
        marginBottom: 0,
        padding: 10,
        borderRadius: 30, 
        flexDirection:'row', 
        flexWrap:'wrap',
        borderColor: '#4e4f4e',
        borderWidth: 1,
        
      },
      sectionHeader: {
        color: "white",
        paddingLeft: 30,
        paddingTop: 30,
        fontSize: 30
      },
      menuWrapper: {
        alignSelf: 'flex-end',
        margin: 8,
      },
      iconStyle:{
        position:'absolute',
        right:25,
        top: -54,
        zIndex: 150,
        margin: 0,
        padding: 0,
        width: 150
      },
      addMenu: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(45, 40, 42, 0.8)',
        zIndex: 2,
        padding: 30,
      },
      addTask: {
        marginTop: 30,
        padding: 10,
        margin: 10,
        backgroundColor: '#58857d', 
        borderRadius: 20,
        width: '50%',
        marginLeft: '50%'
      },
      textBoxTask: {
        backgroundColor: '#4d484a',
        color: 'white',
        padding: 15, 
        borderRadius: 20
      },
      taskcompleted: {
        color: 'rgba(250, 250, 250, 0.7)',
        lineHeight:15,
        width: '70%',
        marginLeft: 30,
        marginTop:11,
        textDecorationLine: 'line-through',
        fontStyle: 'italic'
      },
      taskincompleted: {
        color: 'white',
        lineHeight:15,
        width: '70%',
        marginLeft: 30,
        marginTop:11,
      },
      listcompleted: {
        marginLeft: 42 ,
        color: 'rgba(250, 250, 250, 0.7)',
        padding: 5, 
        width: 190,
        textDecorationLine: 'line-through',
        fontStyle: 'italic'
      },
      listincompleted: {
        marginLeft: 42 ,
        color: 'white', 
        padding: 5, 
        width: 190,
      },
      datestyle: { 
        textAlign:'center', 
        color: 'rgba(250, 250, 250, 0.5)', 
        padding: 10, 
        paddingBottom: 10
      }
})

export default Content;