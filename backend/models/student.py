from pydantic import BaseModel

class Student(BaseModel):
    attendance: float
    marks: float
    prev_marks: float
    backlogs: int
    mental_stress: int
    study_hours: float
    assignment: float