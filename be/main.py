from fastapi import FastAPI
from pkg.routes import authentication
from pkg.routes.features import watsapp_token
from pkg.routes.mf_process import mf_service
from pkg.routes.notifications import notification
from pkg.routes.ticketing import ticketing
from pkg.routes.user_registration import user_actions
from pkg.routes.customer import customer
from pkg.routes.members import members
from pkg.routes.user_details import factsheet
from pkg.routes.websocket_chat import web_socket_service
# auth
from fastapi.security import (OAuth2PasswordBearer)
# CORS headers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS url
origins = [
    '*', 'https://api-v1.rxtn.in'
]

# adding middleware
app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=['*'],
                   allow_headers=['*']
                   )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
app.include_router(user_actions.user_router, tags=["users"])
app.include_router(members.members_router, tags=["Partners"])
app.include_router(customer.customer_router, tags=["customer"])
app.include_router(authentication.auth_router, tags=["authentication"])
app.include_router(factsheet.master_router, tags=["Client Master Data"])
app.include_router(ticketing.ticket_router, tags=['Ticketing'])
app.include_router(web_socket_service.websocket_router, tags=['socket'])
app.include_router(mf_service.mf_router, tags=['MFProcess'])
app.include_router(notification.notification_router, tags=['Notification'])
app.include_router(watsapp_token.watsapp_router,tags=['Notification'])


@app.get("/health")
def index():
    return {"Message": "Service is Up"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8002)
