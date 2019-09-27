/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  StyleSheet
 } from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


import HomeScreen from './src/screens/home';
import TodoDetails from './src/screens/todoDetails';
import {createTable} from '../TodoApp/src/database/database.js';


const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  TodoDetails: {screen: TodoDetails},
});

const AppContainer = createAppContainer(MainNavigator);


 export default class App extends React.Component {

  constructor(){
      super();
  }

  componentDidMount(){
    createTable()
  }

  render(){
      return(
          <AppContainer/>
      )
  }
}


const styles = StyleSheet.create({
  scrollView: {
  },
 
});

// export default App;
