import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import Onboarding from './screens/Onboarding';
import Routes from './navigation';


export default function App() {

  return (
    <Provider store={store}>
      <Routes/>
      {/* <Onboarding /> */}
    </Provider>
  );
}

registerRootComponent(App)
