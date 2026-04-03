from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class Counselling(Base):
    __tablename__ = "counselling"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    counsellor = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Followup(Base):
    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)
    counselling_id = Column(Integer, ForeignKey("counselling.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    status = Column(String)
    remarks = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
