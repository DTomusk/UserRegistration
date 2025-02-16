from fastapi import FastAPI

from api.routes import auth_routes

app = FastAPI()

app.include_router(auth_routes.router, prefix="/auth")