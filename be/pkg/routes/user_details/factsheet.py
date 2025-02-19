from datetime import datetime

from bson import ObjectId
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

from pkg.database.database import database
from pkg.database.database import user_collection
from pkg.routes.authentication import val_token
from pkg.routes.customer.customer import customers_collection

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
master_router = APIRouter()

financial_cal_collection = database.get_collection('financial_cal')


# Define the Pydantic model for input items
class FinancialItem(BaseModel):
    value: float
    commitment_type: Optional[str] or None = None
    sip: bool


class Sip(BaseModel):
    value: float


class EmergencyFund(BaseModel):
    value: float


class FinancialDetailsInput(BaseModel):
    customer_id: str
    details: List[Dict[str, FinancialItem]]
    Emergency: List[Dict[str, EmergencyFund]]
    sip: List[Dict[str, Sip]]


# Function to read percentages from environment variables
def get_percentage(var_name: str, default: float) -> float:
    return float(os.getenv(var_name, default))


# Separate function to calculate ideal values dynamically
def calculate_ideal_values(take_home: float, details: List[Dict[str, Any]]) -> Dict[str, float]:
    ideal_values = {}

    # Map of detail keys to environment variable names and default percentages
    percentage_map = {
        "rent_emi": ("RENT_EMI_PERCENTAGE", 20),
        "car_emi_other_emi": ("CAR_EMI_PERCENTAGE", 8),
        "provisions": ("PROVISIONS_PERCENTAGE", 8),
        "car_expenses_transportation": ("CAR_EXPENSES_PERCENTAGE", 5),
        "entertainment_ott_outing": ("ENTERTAINMENT_PERCENTAGE", 2.5),
        # Add additional mappings as needed
        "telephone_wifi": ("TELEPHONE_WIFI_PERCENTAGE", 1),
        "eb_water": ("EB_WATER_PERCENTAGE", 0.5),
        "other_investments": ("OTHER_INVESTMENTS_PERCENTAGE", 3),
        "any_other_monthly_expenses": ("ANY_OTHER_MONTHLY_EXPENSES_PERCENTAGE", 2),
        "lic_insurance_post_office": ("LIC_INSURANCE_POST_OFFICE_PERCENTAGE", 1.5),
        "term_health_insurance": ("TERM_HEALTH_INSURANCE_PERCENTAGE", 4),
        "bike_car_insurance": ("BIKE_CAR_INSURANCE_PERCENTAGE", 1),
        "school_fee": ("SCHOOL_FEE_PERCENTAGE", 6),
        "entertainment_ott": ("ENTERTAINMENT_OTT_PERCENTAGE", 1.5),
        "water": ("WATER_PERCENTAGE", 1),
        "tours_travels": ("TOURS_TRAVELS_PERCENTAGE", 4),
        "medical": ("MEDICAL_PERCENTAGE", 5),
        "emergency": ("EMERGENCY_PERCENTAGE", 2),
        "other_annual_expenses": ("OTHER_ANNUAL_EXPENSES_PERCENTAGE", 3),
        "any_other_annual_expenses": ("ANY_OTHER_ANNUAL_EXPENSES_PERCENTAGE", 3)
    }

    # Calculate the ideal values for each category dynamically
    for detail in details:
        for key, value in detail.items():
            if key == "take_home":
                continue
            env_var, default_percentage = percentage_map.get(key, (None, None))
            if env_var:
                actual_value = value.value  # Access monthly attribute directly
                ideal_values[key] = take_home * (get_percentage(env_var, default_percentage) / 100) - actual_value

    return ideal_values


# Function to calculate annual and ideal values and consider commitment types
def calculate_values(details: List[Dict[str, FinancialItem]], take_home: float) -> Dict[str, Dict[str, Any]]:
    output = {}
    total_monthly_expenses = 0.0
    total_liquid_sip = 0.0
    ideal_values = calculate_ideal_values(take_home, details)
    print("ideal", ideal_values)
    for item in details:
        for key, value in item.items():
            monthly_value = value.value
            annual_value = monthly_value * 12
            ideal_value = ideal_values.get(key, None)  # Fetch ideal value if available
            output[key] = {
                "monthly": monthly_value,
                "annual": annual_value,
                "ideal": ideal_value,
                "commitment_type": value.commitment_type,
                "sip": value.sip
            }
            if key != 'take_home':
                total_monthly_expenses += monthly_value
                print(total_monthly_expenses)
            if value.sip:
                total_liquid_sip += monthly_value

        total_annual_expenses = total_monthly_expenses * 12

        savings_annaully = take_home * 12 - total_annual_expenses
        savings_monthly = savings_annaully / 12
        # six_month_expense = total_monthly_expenses * 6
        # available = ideal_values.get('available', 0)
        output["total"] = {
            "total_monthly_expenses": total_monthly_expenses,
            "total_annual_expenses": total_annual_expenses,
            "savings_monthly": savings_monthly,
            "savings_annaully": savings_annaully,
            "total_liquid_sip": total_liquid_sip
            # "Emergency Fund Calculation": {
            # "monthly_expense": total_monthly_expenses,
            # "six_month_expense": six_month_expense,
            # "available": available,
            # "shortage": six_month_expense + available
            # }
        }

    return output


def calculate_emergency_fund(emergency: List[Dict[str, EmergencyFund]], take_home, basic_cal):
    output = {}
    available = 0.0
    for emergency_details in emergency:
        available = emergency_details.get('available', 0).value
    print(available)
    six_month_expense = basic_cal['total']['total_monthly_expenses'] * 6
    output["Emergency Fund Calculation"] = {
        "monthly_expense": basic_cal['total']['total_monthly_expenses'],
        "six_month_expense": six_month_expense,
        "available": available,
        "shortage": six_month_expense + available
    }
    return output


def calculate_sip(sip: List[Dict[str, Sip]]):
    calculate_sip = 0.0
    output = {}
    for sip_details in sip:
        for key, value in sip_details.items():
            add_sip = value.value
            calculate_sip += add_sip
    output['sip_total'] = calculate_sip
    output['mf_equity_share'] = calculate_sip * (get_percentage('MF_EQUITY_DEBT', 27) / 100)
    output['mf_dept'] = calculate_sip - output['mf_equity_share']
    return output


@master_router.post("/calculate")
def calculate(input_data: FinancialDetailsInput, token: str = Depends(val_token)):
    if token[0] is True:
        payload = token[1]
        if payload['role'] in ['admin', 'org-admin']:
            user = user_collection.find_one({'_id': ObjectId(payload['id'])})
        elif payload['role'] == 'customer':
            user = customers_collection.find_one({'_id': ObjectId(payload['id'])})
        else:
            raise HTTPException(status_code=401, detail='user does not access to add calculation')
        if user:
            customer = customers_collection.find_one({'_id': ObjectId(input_data.customer_id)})
            if customer:
                take_home = 0.0
                for item in input_data.details:
                    if 'take_home' in item:
                        take_home = item['take_home'].value
                        break
                # if type == 'M':
                result = {}
                basic_cal = calculate_values(input_data.details, take_home)
                emergency_fund = calculate_emergency_fund(input_data.Emergency, take_home, basic_cal)
                result['basic_cal'] = basic_cal
                result['emergency_fund'] = emergency_fund
                result['sip'] = calculate_sip(input_data.sip)
                result['updated_at'] = datetime.now()
                customer = financial_cal_collection.find_one({'customer_id': str(input_data.customer_id)})
                if customer:
                    update_result = financial_cal_collection.update_one({'customer_id': str(input_data.customer_id)},
                                                                        {'$push': {'financial_calculation': result}}
                                                                        )
                else:
                    insert_result = financial_cal_collection.insert_one(
                        {'customer_id': str(input_data.customer_id),
                         'financial_calculation': [result]}
                    )
                return result
            else:
                raise HTTPException(status_code=404, detail='customer not found')
        else:
            raise HTTPException(status_code=404, detail='user not found')
    else:
        raise HTTPException(status_code=401, detail='Invalid Token/ token expired')


@master_router.post("/factsheet")
async def factsheet_list(token: str = Depends(val_token)):
    if token[0] is True:
        payload = token[1]
        financial_cal_cursor = financial_cal_collection.find()
        resut_list = []
        for data in financial_cal_cursor:
            data['_id'] = str(data['_id'])
            resut_list.append(data)
        return resut_list
    else:
        raise HTTPException(status_code=401, detail='Invalid Token/ token expired')



@master_router.get("/")
def read_root():
    return {"message": "Welcome to the Financial Calculation API"}
