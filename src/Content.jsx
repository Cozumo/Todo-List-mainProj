import { useState, useEffect, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SectionList, TurboModuleRegistry } from 'react-native';
import { RadioButton, IconButton, Menu, Divider, Provider, TextInput } from 'react-native-paper';
import TasksAll, {setTasksAll} from './Data.jsx';


const Content = () => {

  const [checkList , setcheckList] = useState([]);    //Selected Items
  const [Tasks, setTasks] = useState([]);             //Tasks List 
  const [visible, setVisible] = useState(false);      //Menu Visibility

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [sectionData, setsectionData] = useState([    //Section List
    {
    "type": "Incompleted",
    "data":[
  ]},
  {
    "type": "Completed",
    "data":[
  ]}
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

  function RenderTasks (){
        useLayoutEffect(()=>{
      setTasks(TasksAll);
      setData(Tasks);
    }, [Tasks])
  }

  RenderTasks();
    
  const settoComplete = () => {
    checkList.map(element => {
        const setof = Tasks.find(({id}) => id === element);
        setof.iscompleted = true;
        Tasks[Tasks.findIndex(({id}) => id === element)] = setof;
    });
    setTasksAll(Tasks);
    setTasks([...Tasks]);
    setcheckList([]);
    setVisible(false);
  }

  function settoIncomplete(){
    checkList.map(element => {
        const setof = Tasks.find(({id}) => id === element);
        setof.iscompleted = false;
        Tasks[Tasks.findIndex(({id}) => id === element)] = setof;
    });
    setTasksAll(Tasks);
    setTasks([...Tasks]);
    setcheckList([]);
    setVisible(false);
  }

  function deleteTask(){
    checkList.map(element => {
        const index = Tasks.findIndex(({id}) => id === element);
        Tasks.splice(index, 1);
    });
    setcheckList([]);
    setData(Tasks);
    setTasksAll(Tasks);
    setTasks([...Tasks]);
    setVisible(false);
  }

  function checkradio(item){
    if(checkList.includes(item.id))
      setcheckList(checkList.filter((x) => x !== item.id));
    else
      setcheckList([...checkList ,item.id])
  }

  const renderTaskHeader = ({section}) => {
    return (<Text style={styles.sectionHeader}>{ section.type}</Text>)
  }
  
  const renderTaskModel = ({item}) => {
    return (
      <View style={styles.task}>
        <Text style={{width: '5%'}}><RadioButton color='white'  style={{width: 3}} status={checkList.includes(item.id) ? 'checked' : 'unchecked'} value={item.id} onPress={() => {checkradio(item)}}/></Text> 
        <Text style={{color: 'white', lineHeight:15, width: '80%', marginLeft: 30, marginTop:11}}>{item.message}</Text>
      </View>
    )
  }


  
  const [modalvisible, setmodalvisible] = useState(false);
  const [text, setText] = useState("");

  return <View style={styles.mainContainer}>
    <View style={styles.iconStyle}>
      <IconButton style={{position:'relative', right:-100}} icon='dots-vertical' iconColor='white' size={20} onPress={openMenu} />
      <Provider>
        <Menu 
          visible={visible}
          overlayAccessibilityLabel={'Close menu'}
          onDismiss={closeMenu}
          anchor={{x: 0, y: 20}}>
          <Menu.Item onPress={() => {settoComplete()}} title="Mark Complete" />
          <Divider/>
          <Menu.Item onPress={() => {settoIncomplete()}} title="Mark Incomplete" />
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

    {modalvisible &&
      <View style={styles.addMenu}>
      <IconButton style={{marginLeft: '90%', marginBottom: 10}} icon='close' iconColor='white' size={20} onPress={() => (setmodalvisible(false))}/>
      <TextInput
        label={"Enter Username"}
        placeholder={"Enter Username"}
        value={text}
        style={{backgroundColor: '#4d484a'}}
        onChangeText={text => setText(text)}
        theme={{
          dark: true,
          colors: {
                     primary: '#74b0a6',secondary: '#74b0a6', 
             }
       }}
      />
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
        padding: 20,
      }
})

export default Content;