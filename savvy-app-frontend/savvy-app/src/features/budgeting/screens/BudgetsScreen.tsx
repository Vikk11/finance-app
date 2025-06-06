import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import components from "../../../styles/components";
import BackButton from "../../../components/BackButton";
import {auth} from "../../../utils/firebaseConfig";
import style from "./style";
import { AntDesign } from '@expo/vector-icons';
import Budgets from "../components/Budgets";
import {BudgetingScreenProps} from "../../../utils/types";

const BudgetsScreen: React.FC<BudgetingScreenProps<"BudgetsScreen">> = ( { navigation } ) => {
    const [period, setPeriod] = useState("");
    const [openDrawer, setOpenDrawer] = useState<string | null>(null);

    const toggleDrawer = (period: string) => {
        setOpenDrawer(openDrawer === period ? null : period);
    };

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Budgets</Text>

            <View style={{flexGrow:1}}>
                {["weekly", "monthly"].map((period) =>
                    <View key={period} style={{marginBottom: 10}}>
                        <TouchableOpacity style={style.drawer} onPress={() => toggleDrawer(period)}>
                            <Text style={style.drawerText}>
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </Text>
                            <AntDesign name={openDrawer === period ? "up" : "down"} size={24} color="#4d4c4c" />
                        </TouchableOpacity>

                        {openDrawer === period && <Budgets period={period} />}
                    </View>)}
            </View>

            <TouchableOpacity style={components.button} onPress={() => navigation.navigate("AddBudget")}>
                <Text style={components.buttonText}>Add new budget</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BudgetsScreen;
