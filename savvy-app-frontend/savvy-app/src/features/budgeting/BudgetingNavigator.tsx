import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddBudgetScreen from "./screens/AddBudgetScreen";
import { BudgetingStackParamList } from "../../utils/types";

const BudgetingStack = createNativeStackNavigator<BudgetingStackParamList>();

const BudgetingNavigator = () => {
    return (
        <BudgetingStack.Navigator>
            <BudgetingStack.Screen name="AddBudget" component={AddBudgetScreen} />
        </BudgetingStack.Navigator>
    );
};

export default BudgetingNavigator;
