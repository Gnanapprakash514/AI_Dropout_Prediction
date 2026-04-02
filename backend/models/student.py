from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    attendance = Column(Integer)
    marks = Column(Integer)
    prev_marks = Column(Integer)
    backlogs = Column(Integer)
    mental_stress = Column(Integer)
    study_hours = Column(Integer)
    assignment = Column(Integer)

    dropout = Column(Boolean)