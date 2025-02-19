from datetime import datetime

from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from starlette import status

from pkg.database.database import database
from pkg.routes.authentication import val_token
from pkg.routes.emails import Email
from pkg.routes.mf_process.mf_model import MFRequest, MFAccount, EditMfprocess

mf_router = APIRouter()
customers_collection = database.get_collection('customers')
user_collection = database.get_collection('users')
member_collections = database.get_collection('partners')
mfprocess_collection = database.get_collection('mf_process')
notifications_collection = database.get_collection('notifications')
requests_db = []
accounts_db = []


def generate_html_message(changes: dict) -> str:
    html_message = "<ul>"
    for field, value in changes.items():
        html_message += f"<li><strong>{field.capitalize()}:</strong> {value}</li>"
    html_message += "</ul>"
    return html_message


@mf_router.post("/request-mf/")
async def request_mf(mf_request: MFRequest, token: str = Depends(val_token)):
    mf_request = mf_request.dict()
    print(token[0])
    if token[0] is True:
        payload = token[1]
        user = user_collection.find_one({'_id': ObjectId(mf_request['admin_id'])})
        if user:
            customer = customers_collection.find_one({'_id': ObjectId(mf_request['customer_id'])})
            if customer:

                mf_request['pending_changes'] = {
                    **mf_request,
                    'updated_at': datetime.now()
                }
                if mf_request['requested_by'] == 'admin':
                    requester = user['name']
                else:
                    requester = customer['name']
                mf_request_email = {'mftype': mf_request['mftype'], 'amount': mf_request['amount'],
                                    'frequency': mf_request['frequency'],
                                    'status': mf_request['status'], "requested_by": requester, 'updated_at': datetime.now()}
                mf_request['pending_changes']['requested_name'] = requester
                message = generate_html_message(mf_request_email)
                if mf_request['id'] and ObjectId.is_valid(mf_request['id']):
                    find_mf_id = mfprocess_collection.find_one({'_id': ObjectId(mf_request['id'])})

                    if mf_request['status'] == "approve":
                        result = mfprocess_collection.update_one(
                            {'_id': ObjectId(mf_request['id'])},
                            {'$push': {'mf_approved': mf_request_email}}
                        )
                        result = mfprocess_collection.update_one(
                            {'_id': ObjectId(mf_request['id'])},
                            {'$set': mf_request_email}
                        )
                    else:

                        mf_request['pending_changes'] = {
                            **mf_request['pending_changes'],
                            'updated_at': datetime.now()
                        }
                        result = mfprocess_collection.update_one(
                            {'customer_id': str(customer['_id'])},
                            {'$push': {'mf_pending_changes': mf_request['pending_changes']}}
                        )
                        if result.modified_count == 0:
                            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                                detail=f'Unable to update for this customer.')
                else:
                    result = mfprocess_collection.insert_one(
                        {'mftype': mf_request['mftype'], 'customer_id': mf_request['customer_id'],
                         'admin_id': mf_request['admin_id'],
                         'mf_pending_changes': [mf_request['pending_changes']]}
                        )
                    if not result.inserted_id:
                        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                            detail=f'Unable to update for this customer.')
                if mf_request['requested_by'] == 'admin':
                    email = customer['email']
                    subject = f"Approval Required: MF request {customer['email']}"
                else:
                    email = user['email']
                    subject = f"Approval Required: MF request {customer['email']}"

                if customer['partner_id']:
                    for partner in customer['partner_id']:
                        if isinstance(partner, str) and ObjectId.is_valid(partner):
                            # Partner is a valid ObjectId
                            print({'_id': ObjectId(str(partner))})
                            member = member_collections.find_one({'_id': ObjectId(str(partner))})
                            print(member)
                        else:
                            print("2-0----",ObjectId(partner))
                            member = member_collections.find_one({'partner_user_id': partner})
                        if member:
                            print("3",member)
                            mfprocess_collection.update_one({"_id": ObjectId(str(result.inserted_id))},
                                                                {"$set": {"partner_user_id": member['partner_user_id'],
                                                                          "partner_id": str(member['_id']),
                                                                          "updated_at": datetime.now()}})
                            await Email(subject, member['email'], 'customer_request', message).send_email()

                await Email(subject, email, 'customer_request', message).send_email()
            else:
                raise HTTPException(status_code=404, detail='customer not found')
        else:
            raise HTTPException(status_code=404, detail='user not found')
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    # Notify admin and partner logic here (e.g., send an email)
    return {"message": "Request received and admin notified", "request": mf_request['pending_changes']}


@mf_router.get("/customer/mfprocess/")
async def mf_list(token: str = Depends(val_token)):
    if token[0] is True:
        payload = token[1]
        if payload['role'] in ['org-admin', 'admin']:
            user = user_collection.find_one({'_id': ObjectId(payload['id'])})
            if user:
                mf_process_cursor = mfprocess_collection.find()
                resut_list = []
                for data in mf_process_cursor:
                    data['_id'] = str(data['_id'])
                    resut_list.append(data)
                return resut_list
            else:
                raise HTTPException(status_code=404, detail='user not found')
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token or user not authorized')
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@mf_router.post("/edit/mf_process")
async def update_customer(
        edit_mfprocess: EditMfprocess,
        token: tuple = Depends(val_token)
):
    if token[0]:
        payload = token[1]
        if payload['role'] in ['org-admin', 'admin', 'customer']:
            edit_mfprocess = edit_mfprocess.dict(exclude_none=True)
            edit_mfprocess.pop('partner_id', None)

            mfprocess_details = mfprocess_collection.find_one({'_id': ObjectId(edit_mfprocess["id"])})

            if mfprocess_details:
                edit_mfprocess['updated_at'] = datetime.now()

                result = mfprocess_collection.update_one({"_id": ObjectId(edit_mfprocess["id"])}, {"$set": edit_mfprocess})

                if result.matched_count == 0:
                    raise HTTPException(status_code=500, detail="Failed to apply changes.")
                if result.modified_count == 0:
                    return {"message": "No changes made to the mf data"}

                return {"message": f"{mfprocess_details['mftype']} updated successfully"}
            else:
                raise HTTPException(status_code=404, detail=f"Customer {edit_customer['email']} does not exist")
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token or user not authorized')
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@mf_router.get("/customer/{customer_id}/mfprocess/")
async def mf_list_by_customer(customer_id,token: str = Depends(val_token)):
    if token[0] is True:
        payload = token[1]
        if payload['role'] in ['org-admin', 'admin']:
            user = user_collection.find_one({'_id': ObjectId(payload['id'])})
        elif payload['role'] in ['customer']:
            user = customers_collection.find_one({'_id': ObjectId(payload['id'])})
        else:
            raise HTTPException(status_code=404, detail='user not found')
        if user:
            mf_process_cursor = mfprocess_collection.find({'customer_id':str(customer_id)})
            resut_list = []
            for data in mf_process_cursor:
                data['_id'] = str(data['_id'])
                resut_list.append(data)
            return resut_list

        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token or user not authorized')
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired token")