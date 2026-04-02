from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    risk_level = Column(String)