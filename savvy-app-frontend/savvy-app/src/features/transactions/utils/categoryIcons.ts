import React from 'react';
import FoodIcon from "../../../../assets/transaction-icons/food_category.svg"
import HousingIcon from "../../../../assets/transaction-icons/housing-category.svg"
import UtilitiesIcon from "../../../../assets/transaction-icons/utilities-category.svg"
import TransportationIcon from "../../../../assets/transaction-icons/transportation-category.svg"
import HealthIcon from "../../../../assets/transaction-icons/health_category.svg"
import Entertainment from "../../../../assets/transaction-icons/entertainment-category.svg"
import ShoppingIcon from "../../../../assets/transaction-icons/shopping-category.svg"
import EducationIcon from "../../../../assets/transaction-icons/education-category.svg"
import TravelIcon from "../../../../assets/transaction-icons/travel-category.svg"
import CharityIcon from "../../../../assets/transaction-icons/charity-category.svg"
import SubscriptionsIcon from "../../../../assets/transaction-icons/subscriptions-category.svg"
import InsuranceIcon from "../../../../assets/transaction-icons/insurance-category.svg"
import PaymentsIcon from "../../../../assets/transaction-icons/send-money.svg"
import OtherIcon from "../../../../assets/transaction-icons/other-category.svg"
import {SvgProps} from "react-native-svg";

export const categoryIcons: { [key: number]: React.FC<SvgProps> } = {
    1: FoodIcon,
    2: HousingIcon,
    3: UtilitiesIcon,
    4: TransportationIcon,
    5: HealthIcon,
    6: Entertainment,
    7: ShoppingIcon,
    8: EducationIcon,
    9: TravelIcon,
    10: CharityIcon,
    11: SubscriptionsIcon,
    12: InsuranceIcon,
    13: PaymentsIcon,
    14: OtherIcon
}
