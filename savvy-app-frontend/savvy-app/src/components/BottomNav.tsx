import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeIcon from '../../assets/icons/home-icon.svg';
import TransferIcon from '../../assets/icons/transfers-icon.svg';
import ReportIcon from '../../assets/icons/reports-icon.svg';
import LogoutIcon from '../../assets/icons/logout-icon.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import styles from './styles';
import { AppStackParamList } from "../utils/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const BottomNav: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logged out', 'You have been logged out');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error: any){
            Alert.alert('Logout failed.', error.message);
        }
    };

    const goToPage = (page: keyof AppStackParamList) => {
        navigation.navigate(page);
    };

    return (
      <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => goToPage('Home')}>
              <HomeIcon width={45} height={45} />
          </TouchableOpacity>

          <TouchableOpacity>
              <TransferIcon width={40} height={40} />
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
