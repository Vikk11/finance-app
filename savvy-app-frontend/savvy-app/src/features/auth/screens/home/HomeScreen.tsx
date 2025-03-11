import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import BottomNav from '../../../../components/BottomNav';
import styles from './style';
import AddIcon from "../../../../../assets/icons/add-icon.svg";
import RequestIcon from "../../../../../assets/icons/money-request-icon.svg";
import ScanIcon from "../../../../../assets/icons/scan-icon.svg";
import GroupsIcon from "../../../../../assets/icons/groups-icon.svg";
import components from '../../../../styles/components';
import DefaultIcon from "../../../../../assets/icons/default-profile-icon.svg"
import {RootStackParamList} from "../../../../utils/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const goToPage = (page: keyof RootStackParamList, params?: object) => {
        navigation.navigate(page as any, params);
    };

    return (
        <View style={{flex:1}}>
            <View style={styles.homeContainer}>
                <View style = {styles.container}>
                    <Text style = {styles.welcomeText}>Welcome back{"\n"}
                        <Text style={styles.nameText}>John Doe</Text>
                    </Text>
                    <DefaultIcon width={70} height={70} style={{marginRight:10}}/>
                </View>
                <View style={components.container}>
                    <Text>Balance</Text>
                    <Text style = {components.moneyText}>€2,400.45</Text>
                </View>
                <View style={styles.container}>
                    <View style = {{flexDirection: "column"}}>
                        <TouchableOpacity style={styles.buttons} onPress={() => goToPage("Transactions", { screen: "AddMoney" })}>
                            <AddIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Top up</Text>
                    </View>

                    <View style= {{flexDirection:'column'}}>
                        <TouchableOpacity style={styles.buttons}>
                            <RequestIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Requests</Text>
                    </View>

                    <View style={{flexDirection:'column'}}>
                        <TouchableOpacity style={styles.buttons}>
                            <ScanIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Scan</Text>
                    </View>

                    <View style={{flexDirection:'column'}}>
                        <TouchableOpacity style={styles.buttons}>
                            <GroupsIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Groups</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text>Recent Transactions</Text>
                </View>
                <TouchableOpacity style={components.button}>
                    <Text style={components.buttonText}>See all</Text>
                </TouchableOpacity>
                <View style={styles.container}>
                    <View style={components.container}>
                        <Text>Spent this month</Text>
                    </View>
                    <View style={components.container}>
                        <Text>Savings goal</Text>
                    </View>
                </View>
            </View>
            <BottomNav />
        </View>
    );
};

export default HomeScreen;
