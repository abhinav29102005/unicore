# Diagrams

All UML, data-flow, ER and activity diagrams for UniCore.

| Diagram | Where |
|---------|-------|
| Use case | [below](#use-case-diagram) · [PDF (all UML + DFD)](./uml/uml_and_dfd.pdf) |
| Class | [below](#class-diagram) |
| Sequence | [below](#sequence-diagram) |
| Component | [below](#component-diagram) |
| Data flow (Level 0, Level 1) | [below](#data-flow-diagrams) |
| Activity | [activity/UniCore_Activity_Diagrams.pdf](./activity/UniCore_Activity_Diagrams.pdf) |
| ER (full, generated from the SQL schema) | [er/unicore_er_diagram.pdf](./er/unicore_er_diagram.pdf) · [interactive HTML](./er/unicore_er_diagram.html) |
| ER (per schema) | [er/by_schema/](./er/by_schema/) · [below](#er-diagrams-per-schema) |

Regenerate the full ER diagram after a schema change: `python3 diagrams/er/build_er_diagram.py`

---

## Use case diagram
![Use case diagram](../docs/website/public/images/use_case_light.png)

## Class diagram
![Class diagram](../docs/website/public/images/class_diagram_light.png)

## Sequence diagram
![Sequence diagram](../docs/website/public/images/seq_light.png)

## Component diagram
![Component diagram](../docs/website/public/images/comp_light.png)

## Data flow diagrams
**Level 0 (context)**

![DFD level 0](../docs/website/public/images/dfd0_light.png)

**Level 1**

![DFD level 1](../docs/website/public/images/dfd1_light.png)

## ER diagrams per schema
| Schema | Diagram |
|--------|---------|
| Overview | ![ER overview](./er/by_schema/er_diagram.png) |
| Full connectivity | ![Full connectivity](./er/by_schema/full_connectivity.png) |
| auth | ![auth](./er/by_schema/auth.png) |
| audit | ![audit](./er/by_schema/audit.png) |
| academic | ![academic](./er/by_schema/academic.png) |
| hostel | ![hostel](./er/by_schema/hostel.png) |
| library | ![library](./er/by_schema/library.png) |
| exam | ![exam](./er/by_schema/exam.png) |
| admin | ![admin](./er/by_schema/admin.png) |
| core | ![core](./er/by_schema/core.png) |

Combined PDFs: [UniCore_ER_Diagram.pdf](./er/by_schema/UniCore_ER_Diagram.pdf) · [unicore_erd_diagrams.pdf](./er/by_schema/unicore_erd_diagrams.pdf)
