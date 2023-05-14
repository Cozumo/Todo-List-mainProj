import { useState, useEffect, useLayoutEffect } from 'react';
import {  Pressable, StyleSheet, Text, View, SectionList, TurboModuleRegistry } from 'react-native';
import { RadioButton, IconButton, Menu, Divider, Provider } from 'react-native-paper';
import TasksAll from './Data.jsx';


const Content = () => {

  const [checkList , setcheckList] = useState([]);
  const [Tasks, setTasks] = useState([]);
  const [sectionData, setsectionData] = useState([
    {
    "type": "Incompleted",
    "data":[
  ]},
  {
    "type": "Completed",
    "data":[
  ]}
  ]);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  
  
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
        console.log(Tasks);
    });
  }

  function settoIncomplete(){
    checkList.map(element => {
        const setof = Tasks.find(({id}) => id === element);
        setof.iscompleted = false;
        Tasks[Tasks.findIndex(({id}) => id === element)] = setof;
        console.log(Tasks);
    });
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


  return <View style={styles.mainContainer}>
    <View style={styles.iconStyle}>
      <IconButton style={{position:'relative', right:-100}} icon='dots-vertical' iconColor='white' size={20} onPress={openMenu} />
      <Provider>
        <Menu 
          visible={visible}
          onDismiss={closeMenu}
          anchor={{x: 0, y: 20}}>
          <Menu.Item onPress={() => {settoComplete()}} title="Mark Complete" />
          <Divider/>
          <Menu.Item onPress={() => {settoIncomplete()}} title="Mark Incomplete" />
          <Divider/>
          <Menu.Item onPress={() => {settoIncomplete()}} title="Delete" />
        </Menu>
      </Provider>
    </View>


    <SectionList
    sections={sectionData}
    renderItem={renderTaskModel}
    renderSectionHeader={renderTaskHeader}
    />

    <Pressable style={styles.button} onPress={() => {console.log('Added')}}>
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
      }
})

export default Content;