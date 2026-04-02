from pydantic import BaseModel

class StudentInput(BaseModel):
    name: str
    attendance: int
    marks: int
    prev_marks: int
    backlogs: int
    mental_stress: int
    study_hours: int
    assignment: int