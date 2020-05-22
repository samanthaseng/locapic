import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer } from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ChatScreen from './screens/ChatScreen';
import POIScreen from './screens/POIScreen';

import pseudo from './reducers/pseudo';
import POIList from './reducers/POI';

import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({pseudo, POIList}));

var BottomNavigator = createBottomTabNavigator(
  {
    Map: MapScreen,
    POI: POIScreen,
    Chat: ChatScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        var iconName;
        if (navigation.state.routeName == 'Map') {
          iconName = 'ios-navigate';
        } else if (navigation.state.routeName == 'POI') {
          iconName = 'ios-bowtie';
        } else if (navigation.state.routeName == 'Chat') {
          iconName = 'ios-chatboxes';
        }

        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#eb4d4b',
      inactiveTintColor: '#FFFFFF',
      style: {
        backgroundColor: '#130f40',
      }
    },
  },  
  {
    headerMode: 'none'
  }
);

var StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    BottomNavigator: BottomNavigator
  }, 
  {
    headerMode: 'none',
  }
);

const Navigation = createAppContainer(StackNavigator);

export default function App() {
  console.disableYellowBox = true;

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
 }