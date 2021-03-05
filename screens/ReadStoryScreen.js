import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList} from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import db from '../config'

export default class ReadStoryScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={
          search:'',
          allStories:[],
          lastVisibleStory:null
        }
    }

    returnState=()=>{
      this.setState({
      search:'',
      allStories:[],
      lastVisibleStory:null
    })
    }

    retrieveStories = async()=>{
   const query = await db.collection('story-hub').get()
    query.docs.map((doc)=>{
      this.setState({
        allStories:[...this.state.allStories,doc.data()],
        lastVisibleStory: doc
      })
    })
  }

  fetchMoreStories= async() =>{
    var text = this.state.search
     const query = await db.collection('story-hub').where('title', '==',text).startAfter(this.state.lastVisibleStory).limit(5).get()
     query.docs.map((doc)=>{
        this.setState({
          allStories:[...this.state.allStories,doc.data()],
          lastVisibleStory:doc
  })
     })
  }

  searchFilter= async(text)=>{
    if(this.state.search){
    const story = await db.collection('story-hub').where('title', '==', text).get()
      story.docs.map((doc)=>{
        this.setState({
          allStories:[...this.state.allStories,doc.data()],
          lastVisibleStory:doc
        })
      })
    }else if(!this.state.search){
      this.retrieveStories()
    }
  }

    render(){
        return(
            <View style={styles.container}>
                 <Header
                      backgroundColor={'red'}
                      centerComponent={{
                      text: 'Bed Time Stories',
                      style: { color: 'black', fontSize: 23, fontWeight:'bold' },
                      }}
                />
              <View style={styles.searchBar}><TextInput style={styles.bar} placeholder='Enter Story Name' onChangeText={(text)=>{this.setState({search : text})}} value={this.state.search}></TextInput>
          <TouchableOpacity style={styles.searchButton} onPress={()=>{this.searchFilter(this.state.search)}}><Text style={{fontWeight:200}}>Search</Text></TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={()=>{this.returnState()}}><Text>Reset</Text></TouchableOpacity>
          </View>
            <FlatList data={this.state.allStories} renderItem={({item})=>(
                <View style={{borderBottomWidth:2}}>
                <Text>{'Story Title :'+item.title}</Text>
                <Text>{'Author :'+item.author}</Text>
                <Text>{'Story :'+item.story}</Text>
                </View>
          )}>

          keyExtractor={(item,index)=>index.toString()}
          onEndReached={this.fetchMoreStories}
          onEndReachedThreshold=[0.5]
          </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  searchBar:{
    flexDirection:'row',
    height:40,
    width:'auto',
    borderWidth: 0.5,
    alignItems:"center",
    backgroundColor:'#50C878'
  },
  bar:{
    borderWidth:2,
    height:30,
    width:250,
    paddingLeft:10
  },
  searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:'gold'
  }
})
