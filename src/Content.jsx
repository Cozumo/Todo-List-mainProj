import { useState, useEffect, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SectionList, TextInput, TouchableOpacity  } from 'react-native';
import { RadioButton, IconButton, Menu, Divider, Provider} from 'react-native-paper';

import * as Clipboard from 'expo-clipboard';

import { FirebaseDB } from '../firebaseConfig.js';
import { doc, addDoc, collection, onSnapshot, updateDoc , deleteDoc, getDoc} from 'firebase/firestore';


const Content = () => {

  const [checkList , setcheckList] = useState([]);    //Selected Items
  const [Tasks, setTasks] = useState([]);             //Tasks List 
  const [visible, setVisible] = useState(false);      //Menu Visibility
  const [listof, setlistof] = useState(0);             //list of task where data is being pushed to

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  
  const [listmodal, setlistmodalvisible] = useState(false);
  const [modalvisible, setmodalvisible] = useState(false);
  const [text, setText] = useState("");

  const [sectionData, setsectionData] = useState([    //Section List
    {
    "type": "Incompleted",
    "data":[
  ]},
  {
    "type": "Completed",
    "data":[
  ]},
  ]);
  
  
  const setData = (Tasks) => { //setting data into section List 
    const frData = [
      {
      "type": "Incompleted",
      "data":[
    ]},
    {
      "type": "Completed",
      "data":[
    ]}
    ];
    Tasks.map(element => {
      if(element.iscompleted === true){
        frData[1].data.push(element);
      }else{
        frData[0].data.push(element);
      }
    });
    setsectionData([...frData]);
  }

  useEffect(()=> {

    const todoRef = collection(FirebaseDB, 'todos');

    const subscriber = onSnapshot( todoRef, {
      next: (snapshot) => {

        const Tasks = [];
        snapshot.docs.forEach((doc) => {
          Tasks.push({
            id: doc.id,
            ...doc.data(),
          })
        });

        setTasks(Tasks);
        setData(Tasks);
      }
    });

    return () => subscriber();
  }, []);


  const setComplete = async()=>{
    console.log(checkList);
    checkList.map(element => {
      const ref = doc(FirebaseDB, `todos/${element}`);
      updateDoc(ref, {iscompleted: true})
    });
    setcheckList([]);
  }

  const setIncomplete = async()=>{
    console.log(checkList);
    checkList.map(element => {
      const ref = doc(FirebaseDB, `todos/${element}`);
      updateDoc(ref, {iscompleted: false})
    });
    setcheckList([]);
  }

  const deleteTask = async()=>{
    console.log(checkList);
    checkList.map(element => {
      const ref = doc(FirebaseDB, `todos/${element}`);
      deleteDoc(ref)
    });
    setcheckList([]);
  }

  function checkradio(item){
    if(checkList.includes(item.id))
      setcheckList(checkList.filter((x) => x !== item.id));
    else
      setcheckList([...checkList ,item.id])
  }

  const delListItem = async (item, id) => {       //delete item from list function
    console.log("Add to List");

    const ref = doc(FirebaseDB, `todos/${item.id}`);
    newlist = (await getDoc(ref)).data().list;
    newlist.splice(id, 1);
    updateDoc(ref, {list: newlist})
  }

  function openListmodal(id){
    setlistof(id);
    setlistmodalvisible(true);
    console.log(listof);
  }

  const copyToClipboard = async (item) => {
    await Clipboard.setStringAsync(item.message + "\n" + item.list.map(el => "-\t" + el + "\n"));
  };
  
  const renderTaskHeader = ({section}) => {
    return (<Text style={styles.sectionHeader}>{ section.type}</Text>)
  }

  const end = () => {
    return (<Text style={{padding: 100}}>{"\n\n\\n\n"}</Text>)
  }

  const renderTaskModel = ({item}) => {
    return (
      <Pressable onPress={() => {checkradio(item)}} onLongPress={() => copyToClipboard(item)} style={({ pressed }) => [{opacity:pressed ? 0.5 : 1}]}>
        <View style={styles.task}>
          <Text style={{width: '5%'}}><RadioButton color='white'  style={{width: 3}} status={checkList.includes(item.id) ? 'checked' : 'unchecked'} value={item.id} onPress={() => {checkradio(item)}}/></Text> 
          <Text style={ item.iscompleted ? styles.taskcompleted : styles.taskincompleted }>{item.message}</Text>
          <Text><IconButton style={{}} icon='plus' iconColor='white' size={20} onPress={() => ( openListmodal(item.id))}/></Text>
          {item.list.map(element => 
            <View style={{width: '97%', flexDirection:'row', flexWrap:'wrap', justifyContent: 'space-between'}}>
              <Text style={ item.iscompleted ? styles.listcompleted : styles.listincompleted}>➥  {element}</Text>
              <Text><IconButton style={{}} icon='delete' iconColor='white' size={20} onPress={() => (delListItem(item, element.id))}/></Text>
            </View>
          ) }
          <Text style={styles.datestyle}>{item.date}</Text>
        </View>
      </Pressable>
    )
  }

  const addTodo = async () => {       //Add todo function
    console.log("Add Data");
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = String(today.getFullYear());
    const dateToday = dd+'/'+mm+'/'+yyyy;

    const doc = addDoc(collection(FirebaseDB, 'todos'), {message: text, iscompleted: false, date: dateToday, list: [] })
  }

  const addList = async () => {       //Add list function
    console.log("Add to List");

    const ref = doc(FirebaseDB, `todos/${listof}`);
    newlist = (await getDoc(ref)).data().list;
    newlist.push(text);
    updateDoc(ref, {list: newlist})
    console.log((await getDoc(ref)).data())
  }

  return <View style={styles.mainContainer}>
    <View style={styles.iconStyle}>
      <IconButton style={{position:'relative', right:-100}} icon='dots-vertical' iconColor='white' size={20} onPress={openMenu} />
      <Provider>
        <Menu 
          visible={visible}
          overlayAccessibilityLabel={'Close menu'}
          onDismiss={closeMenu}
          anchor={{x: 0, y: 20}}>
          <Menu.Item onPress={() => {setComplete()}} title="Mark Complete" />
          <Divider/>
          <Menu.Item onPress={() => {setIncomplete()}} title="Mark InComplete" />
          <Divider/>
          <Menu.Item onPress={() => {deleteTask()}} title="Delete" />
        </Menu>
      </Provider>
    </View>

    <SectionList
    sections={sectionData}
    renderItem={renderTaskModel}
    renderSectionHeader={renderTaskHeader}
    />

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

      <Pressable style={styles.addTask} onPress={addList} >
        <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Add To List</Text>
      </Pressable>
    </View>}


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

      <Pressable style={styles.addTask} onPress={() => (addTodo())}>
        <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>Add Task</Text>
      </Pressable>
    </View>}

    <Pressable style={styles.button} onPress={() => (setmodalvisible(true))}>
      <Text style={{ color: 'white', textAlign:'center', fontSize: 20}}>+</Text>
    </Pressable>
  </View>
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#2d282a',
        flex: 0.90,
        paddingBottom: 20
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        elevation: 3,
        backgroundColor: '#476a64',
        padding: 5,
        width: '16%',
        height: '9%',
        position: 'absolute',
        top: '86%',
        left: '77%'
      },
      task: {
        backgroundColor: '#476a64',
        margin: 20,
        marginTop: 30,
        marginBottom: 0,
        padding: 10,
        borderRadius: 20, 
        flexDirection:'row', 
        flexWrap:'wrap'
      },
      sectionHeader: {
        color: "white",
        paddingLeft: 30,
        paddingTop: 50,
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
        backgroundColor: '#476a64', 
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