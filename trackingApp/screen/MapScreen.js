import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import BackgroundGeolocation from 'react-native-background-geolocation';
import socketIO from 'socket.io-client';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);
export class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
      error: null,
    };
    this.socket = null;
  }
  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );

      this.socket = socketIO('http://192.168.1.67:3000/', {
        query:
          'auth_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZDdjMTM2ZWQ0ZjBkMDA0OTc3ZDRhOTAiLCJuYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAdXJnZWdhcy5jb20iLCJpYXQiOjE1NjkxNzc3NzB9.EXfPzmqw9pN7itQyeSTNjRU4EbCTKiib_gV7G9_C6u4',
      });
      this.socket.on('connect', () => {
        console.log('connected to socket serv');
      });
      BackgroundGeolocation.onLocation((location, error) => {
        this.sendObject(location.coords);
      });
      BackgroundGeolocation.onMotionChange(onMotionChange => {
        this.sendObject(onMotionChange.location.coords);
      });
      BackgroundGeolocation.ready(
        {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 1,
          debug: false,
          stopTimeout: 1,
          logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
          stopOnTerminate: false,
          stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
          startOnBoot: true, // <-- Auto start tracking when device is powered-up.
          // HTTP / SQLite config
          url: 'http://192.168.1.67:3000/api/test',
          batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
          autoSync: true,
        },
        state => {
          console.log(
            '- BackgroundGeolocation is configured and ready: ',
            state.enabled,
          );
          if (!state.enabled) {
            BackgroundGeolocation.start(function() {
              console.log('- Start success');
            });
          }
        },
      );
    } catch (e) {}
  }

  sendObject(coords) {
    const obj = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    this.socket.emit('coordenites', obj);
  }
  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();

    this.sendObject();
    this.socket.disconnect();
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };
  setRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  });
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <View style={{flex: 1, height: '100%'}}>
          <MapView
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.01,
            }}
            provider={PROVIDER_GOOGLE}
            style={{flex: 1, width: '100%', height: '100%'}}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
  },
});
export default MapScreen;
