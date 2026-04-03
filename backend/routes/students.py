from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.student import Student

router = APIRouter()


@router.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return students
