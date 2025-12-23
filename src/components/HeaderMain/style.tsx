import { StyleSheet, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  headerMain: {
    height: height * 0.064,
    backgroundColor: '#F7D102',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOne: {
    backgroundColor: '#fff',
    height: height * 0.064,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 33,
    borderBottomRightRadius: 33,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    right:33
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerOneView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  homeText: {
    fontSize: 18,
    fontWeight: 'bold',

  },
  addressText: {
    fontSize: 14,
    color: '#555',
    left:15,
    justifyContent: 'center'
    , textAlign: 'center'

  },
  icon: {
    marginLeft: 30,
  },
  headerTwo:{
    height: height * 0.064,
    flexDirection: 'column',
    left: 63,
    justifyContent: 'center',

    alignItems: 'center'



  }
});
