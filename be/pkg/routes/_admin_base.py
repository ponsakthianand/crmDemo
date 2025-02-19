# crud.py
from typing import List
from bson import ObjectId
from pkg.database.database import super_admin_collection, partner_collection, customer_collection
from pkg.routes._schemas import SuperAdminCreate, PartnerCreate, CustomerCreate


async def create_super_admin(super_admin: SuperAdminCreate):
    super_admin_dict = super_admin.dict()
    result = await super_admin_collection.insert_one(super_admin_dict)
    super_admin_dict["_id"] = str(result.inserted_id)
    return super_admin_dict


async def create_partner(partner: PartnerCreate):
    partner_dict = partner.dict()
    result = await partner_collection.insert_one(partner_dict)
    partner_dict["id"] = str(result.inserted_id)
    return partner_dict


async def create_customer(customer: CustomerCreate):
    customer_dict = customer.dict()
    if customer_dict.get("partner_id"):
        customer_dict["partner_id"] = ObjectId(customer_dict["partner_id"])
    result = await customer_collection.insert_one(customer_dict)
    customer_dict["_id"] = str(result.inserted_id)
    customer_dict["partner_id"] = str(customer_dict["partner_id"])
    return customer_dict


async def get_customers_by_partner(partner_id: str) -> List[dict]:
    partner = await partner_collection.find_one({"_id": ObjectId(partner_id)})
    if not partner:
        return []
    customers = await customer_collection.find({"partner_id": ObjectId(partner_id)}).to_list(length=100)
    for customer in customers:
        customer["_id"] = str(customer["_id"])
        if customer.get("partner_id"):
            customer["partner_id"] = str(customer["partner_id"])
    return customers
