import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeIcon from '../../assets/icons/home-icon.svg';
import TransferIcon from '../../assets/icons/transfers-icon.svg';
import GroupsIcon from '../../assets/icons/groups-icon.svg';
import ReportIcon from '../../assets/icons/reports-icon.svg';
import LogoutIcon from '../../assets/icons/logout-icon.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import styles from './styles';
import { RootStackParamList } from "../utils/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BottomNav: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logged out', 'You have been logged out');
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth", params: { screen: "Login" } }],
            });
        } catch (error: any){
            Alert.alert('Logout failed.', error.message);
        }
    };

    const goToPage = (page: keyof RootStackParamList, params?: object) => {
        navigation.navigate(page as any, params);
    };

    return (
      <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => goToPage("Auth", { screen: "Home" })}>
              <HomeIcon width={25} height={25} />
          </TouchableOpacity>

          <TouchableOpacity>
              <TransferIcon width={30} height={30} />
          </TouchableOpacity>

          <TouchableOpacity>
              <GroupsIcon width={30} height={30} />
          </TouchableOpacity>

          <TouchableOpacity>
              <ReportIcon width={30} height={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
              <LogoutIcon width={30} height={30} />
          </TouchableOpacity>
      </View>
    );
}

export default BottomNav;
