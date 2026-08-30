import base64
import urllib.request
import re

def generate_mermaid(source, filename):
    encoded = base64.b64encode(source.encode('utf-8')).decode('utf-8')
    url = f"https://mermaid.ink/img/{encoded}?bgColor=FFFFFF"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

def generate_mermaid_dark(source, filename):
    encoded = base64.b64encode(source.encode('utf-8')).decode('utf-8')
    url = f"https://mermaid.ink/img/{encoded}?bgColor=0a0d14" # dark bg
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

light_theme = """%%{init: {'theme': 'base', 'themeVariables': {
    'primaryColor': '#fee2e2',
    'primaryBorderColor': '#b91c1c',
    'primaryTextColor': '#7f1d1d',
    'lineColor': '#b91c1c',
    'textColor': '#7f1d1d',
    'mainBkg': '#fee2e2',
    'nodeBorder': '#b91c1c',
    'clusterBkg': '#ffffff',
    'clusterBorder': '#b91c1c',
    'defaultLinkColor': '#b91c1c',
    'titleColor': '#7f1d1d',
    'edgeLabelBackground': '#ffffff'
}}}%%
"""

dark_theme = """%%{init: {'theme': 'base', 'themeVariables': {
    'primaryColor': '#1e293b',
    'primaryBorderColor': '#ef4444',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#ef4444',
    'textColor': '#f8fafc',
    'mainBkg': '#1e293b',
    'nodeBorder': '#ef4444',
    'clusterBkg': '#0a0d14',
    'clusterBorder': '#ef4444',
    'defaultLinkColor': '#ef4444',
    'titleColor': '#f8fafc',
    'edgeLabelBackground': '#0a0d14'
}}}%%
"""

usecase_source = """
flowchart LR
    S(("Student"))
    AS(("Academic Staff"))
    HW(("Hostel Warden"))
    LA(("Library Admin"))

    subgraph UniCore System
        E([Enroll in Courses])
        V([Verify Prerequisites])
        P([Post Semester Grades])
        A([Allot Hostel Bed])
        L([Lock Bed Capacity])
        I([Issue & Borrow Books])
        Emit([Emit JSON Audit Log])
    end

    S --> E
    S --> A
    S --> I
    E -.->|include| V
    AS --> P
    HW --> L
    P -.->|include| Emit
    A -.->|include| Emit
    L -.->|include| Emit
    I -.->|include| Emit
"""

class_source = """
classDiagram
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

generate_mermaid(light_theme + usecase_source, 'docs/hub/public/images/use_case_light.png')
generate_mermaid_dark(dark_theme + usecase_source, 'docs/hub/public/images/use_case_dark.png')
generate_mermaid(light_theme + class_source, 'docs/hub/public/images/class_diagram_light.png')
generate_mermaid_dark(dark_theme + class_source, 'docs/hub/public/images/class_diagram_dark.png')

# Update App.jsx
with open('docs/hub/src/App.jsx', 'r') as f:
    app = f.read()

# Replace the Usecase <pre> block
usecase_regex = re.compile(r'<pre className="font-mono text-\[11px\] text-red-700 dark:text-red-300 leading-relaxed whitespace-pre">\n\{`.*?(Student  ──────────►).*?`\}\n\s*</pre>', re.DOTALL)
img_usecase = """<div className="w-full flex justify-center py-2">
                            <img src="/images/use_case_light.png" alt="Use Case Diagram" className="dark:hidden max-w-full h-auto rounded-lg" />
                            <img src="/images/use_case_dark.png" alt="Use Case Diagram" className="hidden dark:block max-w-full h-auto rounded-lg" />
                          </div>"""
app = usecase_regex.sub(img_usecase, app)

# Replace the Class Diagram <pre> block
class_regex = re.compile(r'<pre className="font-mono text-\[11px\] text-red-700 dark:text-red-300 leading-relaxed whitespace-pre">\n\{`┌─────────────────────────┐.*?`\}\n\s*</pre>', re.DOTALL)
img_class = """<div className="w-full flex justify-center py-2">
                            <img src="/images/class_diagram_light.png" alt="Class Diagram" className="dark:hidden max-w-full h-auto rounded-lg" />
                            <img src="/images/class_diagram_dark.png" alt="Class Diagram" className="hidden dark:block max-w-full h-auto rounded-lg" />
                          </div>"""
app = class_regex.sub(img_class, app)

with open('docs/hub/src/App.jsx', 'w') as f:
    f.write(app)

print("App.jsx updated.")
