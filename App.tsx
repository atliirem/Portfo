import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from "./src/redux/store";
import RootStack from './src/navigation/RootStack';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem('@TOKEN');
      console.log(" STORED TOKEN:", token);
    };
    load();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}
