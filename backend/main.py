from fastapi import FastAPI
from database import engine, Base
from models.student import Student
from routes import predict

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(predict.router)