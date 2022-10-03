import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue } from'firebase/database';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const firebaseConfig = {
    apiKey: "AIzaSyCmH3YywfCGazVqBD0WD9vTSbZkJcp16yw",
    authDomain: "poolanproject.firebaseapp.com",
    databaseURL: "https://poolanproject-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "poolanproject",
    storageBucket: "poolanproject.appspot.com",
    messagingSenderId: "658229132912",
    appId: "1:658229132912:web:9359e86bd3da03abbcbeb5"
  };
  
  const app = initializeApp(firebaseConfig); 
  const database = getDatabase(app);

  ref(database,'items/')

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppingList (id integer primary key not null, product text, amount text);');
    }, null, updateList); 
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shoppingList (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppingList;', [], (_, { rows }) =>
        setList(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppingList where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='amounts' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping List</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Done</Text></View>} 
        data={list} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});