import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../redux/Hooks';
import { getTypes } from '../../../api';
import { setProject } from '../../redux/Slice/formSlice';
import ChildrenModal from './Proje/ChildrenModal';
import TextInputUser from '../../components/TextInput/TextInputUser';

interface Props {
    onValidate: (fn: ()=> boolean)=> void;
}

const RoomInputs: React.FC<Props> = ({onValidate}) => {
    const dispatch= useDispatch();

    const createAdData= useAppSelector((state)=> state.form);

    const {features}= useAppSelector((state)=> state.types)

    const [roomModalVisible, setRoomModalVisible]= useState(false);

    const [errors, setErrors]= useState({
        room: false,
        min: false,
        max: false,
    });

    const roomFeature= features.find((f)=> f.title=== "Oda Sayısı");

    useEffect(() => {
      dispatch(getTypes())
    }, [dispatch])
    
    const handleRoomSelect= (roomTitle: string)=> {
        dispatch(setProject({roomCount: roomTitle}));
        setErrors((prev)=> ({...prev, room: false}));
        setRoomModalVisible(false);
    };

    const handleMinChange= (text: string)=>{
        dispatch(setProject({min: ""}))
        return;
    }

    const num= Number(text);
    if(Number.isNaN(num)) return;

    if(num<1){
        Alert.alert("Geçersiz değer", "Minimum değer 1 olmalıdır." );
        return;
    }

    dispatch(setProject({min: text}));
    setErrors((prev)=> ({...prev, min: false}));

    const handleMaxChange= (text: string)=> {
        dispatch(setProject({max: text}));
        if(text.trim() !== ""){
            setErrors((prev)=> ({...prev, max: false
            }));
        }
    };

    const validateFields=()=>{
        const newErrors={
            room: createAdData.project.roomCount.trim()==="",
            min: createAdData.project.min.trim()==="",
            max: createAdData.project.max.trim()==="",
        };

        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    useEffect(() => {
     onValidate(()=> validateFields())
    }, [
        createAdData.project.roomCount,
        createAdData.project.min,
        createAdData.project.max,
    ]);

    

  return (
    <View>
    
    <TouchableOpacity>
        <TextInputUser 
        isModal={true}
        placeholder='Oda sayısını seç'
        value={createAdData.project.roomCount}
        editable={false}
        error={errors.room}
        onChangeText={()=> {}}
        
        />
    </TouchableOpacity>

    <ChildrenModal
    isVisible={roomModalVisible} 
    onClose={()=> setRoomModalVisible(false)}
    loading={false}
    options={roomFeature?.options ?? []}
    onSelect={(item)=> handleRoomSelect(item.title)}
    />

    <View>
        <TextInputUser
        placeholder='Metrekareye (m2) min ' keyboardType='numeric' value={createAdData.project.min} containerStyle={errors.min ? styles.errorInput: undefined} onChangeText={handleMinChange}/>
    </View>

     <View>
        <TextInputUser
        placeholder='Metrekareye (m2) max ' keyboardType='numeric' value={createAdData.project.max} containerStyle={errors.max ? styles.errorInput: undefined} onChangeText={handleMaxChange}/>
    </View>

    </View>
  )
}

export default RoomInputs

const styles = StyleSheet.create({
  textInput: { marginTop: 12 },
  errorInput: {
    borderWidth: 1.5,
    borderColor: "red",
    borderRadius: 8,
  },
});
