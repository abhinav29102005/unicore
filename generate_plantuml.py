import urllib.request
import urllib.parse

def generate_diagram(puml_content, filename):
    url = "https://kroki.io/plantuml/png"
    req = urllib.request.Request(url, data=puml_content.encode('utf-8'), headers={'Content-Type': 'text/plain'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

light_skin = """
skinparam dpi 300
skinparam backgroundColor transparent
skinparam defaultFontName sans-serif
skinparam defaultFontColor #7f1d1d
skinparam usecase {
  BackgroundColor #fee2e2
  BorderColor #b91c1c
  ArrowColor #b91c1c
  FontColor #7f1d1d
}
skinparam actor {
  BackgroundColor #fee2e2
  BorderColor #b91c1c
  FontColor #7f1d1d
}
skinparam rectangle {
  BorderColor #b91c1c
  FontColor #7f1d1d
}
skinparam class {
  BackgroundColor #fee2e2
  BorderColor #b91c1c
  ArrowColor #b91c1c
  FontColor #7f1d1d
  AttributeFontColor #7f1d1d
}
"""

dark_skin = """
skinparam dpi 300
skinparam backgroundColor transparent
skinparam defaultFontName sans-serif
skinparam defaultFontColor #f8fafc
skinparam usecase {
  BackgroundColor #1e293b
  BorderColor #ef4444
  ArrowColor #ef4444
  FontColor #f8fafc
}
skinparam actor {
  BackgroundColor #1e293b
  BorderColor #ef4444
  FontColor #f8fafc
}
skinparam rectangle {
  BorderColor #ef4444
  FontColor #f8fafc
}
skinparam class {
  BackgroundColor #1e293b
  BorderColor #ef4444
  ArrowColor #ef4444
  FontColor #f8fafc
  AttributeFontColor #f8fafc
}
"""

usecase_body = """
left to right direction

actor "Student" as student
actor "Academic Staff" as acad
actor "Hostel Warden" as warden
actor "Library Admin" as lib

rectangle "<<Subsystem>>\\nUniCore Campus Platform" {
  usecase "Enroll in Courses" as UC_Enroll
  usecase "Post Semester Grades" as UC_Grades
  usecase "Allot Hostel Bed" as UC_Bed
  usecase "Issue / Borrow Books" as UC_Library
}

actor "<<Service>>\\nTezz Authentication" as auth
actor "Audit Logging Service" as audit
actor "PostgreSQL Cluster" as db

student -- UC_Enroll
student -- UC_Bed
student -- UC_Library

acad -- UC_Grades

warden -- UC_Bed

lib -- UC_Library

UC_Enroll -- auth
UC_Grades -- auth
UC_Bed -- auth
UC_Library -- auth

UC_Enroll -- audit
UC_Grades -- audit
UC_Bed -- audit
UC_Library -- audit

UC_Enroll -- db
UC_Grades -- db
UC_Bed -- db
UC_Library -- db
"""

class_body = """
class User {
  +UUID id
  +String email
  +Enum user_type
}

class User_Role {
  +UUID user_id
  +UUID role_id
}

class Role {
  +UUID id
  +String name
}

class Student {
  +UUID id
  +String roll_number
  +Numeric current_cgpa
}

class Enrollment {
  +UUID id
  +UUID student_id
  +UUID course_id
  +String grade
}

class Bed_Allocation {
  +UUID id
  +UUID student_id
  +UUID room_id
  +Enum status
}

class Borrow_Record {
  +UUID id
  +UUID member_id
  +UUID book_copy_id
  +Timestamp due_date
}

User "1" *-- "1..*" User_Role
User_Role "*" --> "1" Role
User "1" <|-- "1" Student
Student "1" -- "*" Enrollment
Student "1" -- "*" Bed_Allocation
Student "1" -- "*" Borrow_Record
"""

puml_template = "@startuml\n!theme plain\n{skin}\n{body}\n@enduml"

generate_diagram(puml_template.format(skin=light_skin, body=usecase_body), 'docs/hub/public/images/use_case_light.png')
generate_diagram(puml_template.format(skin=dark_skin, body=usecase_body), 'docs/hub/public/images/use_case_dark.png')
generate_diagram(puml_template.format(skin=light_skin, body=class_body), 'docs/hub/public/images/class_diagram_light.png')
generate_diagram(puml_template.format(skin=dark_skin, body=class_body), 'docs/hub/public/images/class_diagram_dark.png')

print("PlantUML diagrams generated successfully.")
