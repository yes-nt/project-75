import * as React from 'react'
import {View , Text, TextInput, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { Header} from 'react-native-elements';
import firebase from 'firebase'

export default class LoginScreen extends React.Component{

  constructor(){
    super()
    this.state={
      emailId:'',
      password:''
    }
  }

  login= async(email, password)=>{
    if(email && password){
      try{
        const response = await firebase.auth().signInWithEmailAndPassword(email, password)
        if(response){
          this.props.navigation.navigate('WriteStory')
        }     
      }
      catch(error){
        switch(error.code){
          case 'auth/user-not-found':
          alert("User doesnt exist")
          break;
          case 'auth/invalid-email/invalid-password':
          alert("incorrect email or password")
          console.log("invalid")
        }
      }
    }
    else{
      alert("enter email & password")
    }
  }

  render(){
    return(
      <View>
      <Header
                      backgroundColor={'red'}
                      centerComponent={{
                      text: 'Bed Time Stories',
                      style: { color: 'black', fontSize: 23, fontWeight:'bold' },
                      }}
                />
      <Image
      source={
        require('../assets/main-Bedtime.jpg')}
        style = {{width:200, height:200, marginLeft:'18%', marginTop:20}}
      />
      <TextInput style={styles.loginBox} placeholder='Email ID' onChangeText={(text)=>{this.setState({emailId:text})}} keyboardType='email-address' value={this.state.emailId}></TextInput>
      <TextInput style={styles.loginBox} placeholder='Password' onChangeText={(text)=>{this.setState({password:text})}} secureTextEntry={true} value={this.state.password}></TextInput>
      <TouchableOpacity style={styles.loginButton} onPress={()=>{this.login(this.state.emailId, this.state.password)}}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loginBox:{
    width:300,
    height:40,
    borderWidth:1.5,
    fontSize:20,
    margin:10,
    paddingLeft:10
  },
  loginButton:{
    borderRadius:25,
    backgroundColor:'yellow', 
    height:50, 
    width:100, 
    borderWidth:5, 
    marginTop:15,
    alignSelf:"center"
  },
  buttonText:{
    fontWeight:'bold', 
    fontSize:15, 
    textAlign:"center", 
    marginTop:8
  }
})