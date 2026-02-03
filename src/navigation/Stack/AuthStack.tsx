import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Login"
import VerifyCode from "../../screens/Update/LostPassword/VerifyCode";
import PushNewPassword from "../../screens/Update/LostPassword/PushNewPassword";




const Stack= createNativeStackNavigator();

const AuthStack=()=>{
    return(
   
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>  



        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="VerifyCode" component={VerifyCode}/>
        <Stack.Screen name="PushNewPassword" component={PushNewPassword}/>
    
       </Stack.Navigator>
        
    )
}

export default AuthStack;