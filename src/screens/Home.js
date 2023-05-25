import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {colors} from '../assets/colors';
import LogoutButton from '../components/LogoutButton';
import Item from '../components/Item';
import firestore from '@react-native-firebase/firestore';
import {CommonActions} from '@react-navigation/native';

const Home = ({navigation}) => {
  const [data, setData] = useState([]);

  const getUsers = () => {
    const switchOffListener = firestore()
      .collection('users')
      .onSnapshot(
        //listener: dados vão ser retornados toda vez que houver uma alteração
        function (querySnapshot) {
          let arrayDados = [];
          querySnapshot.forEach(function (doc) {
            //console.log(doc.id, ' => ', doc.data());
            const user = {
              id: doc.id,
              nome: doc.data().nome,
              email: doc.data().email,
            };
            arrayDados.push(user);
            //console.log(arrayzinho);
          });
          setData(arrayDados);
        },
        error => {
          console.log(
            error + 'HOME - Não foi possível recuperar dados dos users',
          );
        },
      );
    return switchOffListener;
  };

  useEffect(() => {
    const switchOffListener = getUsers();
    return () => {
      console.log('desmontando componente Home e desligando listener');
      switchOffListener();
    };
  }, []);

  const routeUser = item => {
    //envia para rota de alteração de dados do usuário
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditaUser',
        params: {user: item},
      }),
    );
  };

  const renderItem = ({item}) => (
    <Item item={item} onPress={() => routeUser(item)} />
  );
  return (
    <SafeAreaView>
      <View style={style.pageHome}>
        <FlatList //cada item dentro da flatlist renderiza o componente que for passado na função render
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={style.bottom}>
        <LogoutButton style={style.button} />
      </View>
    </SafeAreaView>
  );
};
export default Home;

const style = StyleSheet.create({
  pageHome: {
    display: 'flex',
    height: '80%',
    //backgroundColor: 'gray',
    //height: '100%',
  },
  bottom: {
    height: '20%',
  },
  button: {
    marginLeft: '40',
    //width: '50%',
  },
  nameApp: {
    color: colors.primaryDark,
    fontSize: 40,
    marginTop: 10,
  },
});
