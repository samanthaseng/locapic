import React, { useEffect, useState } from 'react';
import { AsyncStorage, View, TextInput, Dimensions } from 'react-native';
import {connect} from 'react-redux';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.14:3000", { forceNode: true });

function MapScreen(props) {
  const [currentLatitude, setCurrentLatitude] = useState(48.866667);
  const [currentLongitude, setCurrentLongitude] = useState(2.3333334);
  const [addPOI, setAddPOI] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coordPOI, setCoordPOI] = useState();
  const [titrePOI, setTitrePOI] = useState();
  const [descPOI, setDescPOI] = useState();
  const [listCoords, setListCoords] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("POIList", (error, value) => {
      if (value) {
        props.getPOI(JSON.parse(value));
      }
    })

    async function askPermissions() {
      var { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2},
          (location) => {
            setCurrentLatitude(location.coords.latitude);
            setCurrentLongitude(location.coords.longitude)

            socket.emit("sendCoords", {pseudo: props.userPseudo, latitude: location.coords.latitude, longitude: location.coords.longitude})
          }
        )
      }
    }
    askPermissions();
  }, [])

  useEffect(() => {
    socket.on("sendCoordsToAll", (coordsData) => {
      var listCoordsCopy = [...listCoords];
      listCoordsCopy = listCoordsCopy.filter(user => user.pseudo !== coordsData.pseudo)
      listCoordsCopy.push(coordsData);
      setListCoords(listCoordsCopy);
    })
  }, [listCoords])

  var POIMarkersTab = props.POIListToDisplay.map((POI, i) => {
    return (
      <Marker 
        key={i}
        coordinate={{latitude: POI.latitude, longitude: POI.longitude}}
        title = {POI.title}
        description = {POI.description}
        pinColor={'blue'}
      />
    )
  })

  var friendsMarkersTab = listCoords.map((coordsData, i) => {
    return (
      <Marker 
        key={i}
        coordinate={{latitude: coordsData.latitude, longitude: coordsData.longitude}}
        title = {coordsData.pseudo}
        description = 'is here'
        pinColor={'green'}
      />
    )
  })

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <MapView style={{flex : 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.3333334,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={e => {
          if (addPOI) {
            setAddPOI(false);
            setIsVisible(true);
            setCoordPOI({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
          }          
        }}
      >
        <Marker 
          coordinate={{latitude: currentLatitude, longitude: currentLongitude}}
          title = {props.userPseudo}
          description = "You are here"
          pinColor={'red'}
        />

        {POIMarkersTab}
        {friendsMarkersTab}
      </MapView>

      <Button 
        title="Add POI"
        icon={
            <Icon
                name="map-marker"
                size={20}
                color="#ffffff"
            />
        }
        type="solid"
        buttonStyle={{backgroundColor: '#ea4e52', width: Dimensions.get('window').width}}
        onPress={() => setAddPOI(true)}
        disabled={addPOI}
      />  
      
      <Overlay isVisible={isVisible} overlayStyle={{width: 300, height: 300}}>
        <View>
          <TextInput 
            placeholder="Titre" 
            onChangeText={(val) => setTitrePOI(val)}
            style={{borderColor: "#000000", borderBottomWidth: 1, marginBottom: 36, marginTop: 15}} />
          <TextInput 
            placeholder="Description" 
            onChangeText={(val) => setDescPOI(val)}
            style={{borderColor: "#000000", borderBottomWidth: 1, marginBottom: 36}} />
          <Button title="Ajouter POI" buttonStyle={{backgroundColor: '#ea4e52'}} 
            onPress={() => {
              const rand = 1 + Math.random() * (99);
              var newPOI = {id: rand, latitude: coordPOI.latitude, longitude: coordPOI.longitude, title: titrePOI, description: descPOI}

              var copyListPOI = [...props.POIListToDisplay, newPOI];
              AsyncStorage.setItem("POIList", JSON.stringify(copyListPOI));
              props.addPOI(newPOI);

              setIsVisible(false);
              setCoordPOI();
              setTitrePOI();
              setDescPOI();
            }}
          />
        </View>
      </Overlay>
      
    </View>
  );
}

function mapStateToProps(state) {
  return { userPseudo: state.pseudo, POIListToDisplay: state.POIList }
}

function mapDispatchToProps(dispatch) {
  return {
      addPOI: function(POI) { 
        dispatch( {type: 'savePOI', POI: POI} ) 
      },
      getPOI: function(POIList) {
        dispatch( {type: 'getPOI', POIList: POIList})
      }
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(MapScreen);