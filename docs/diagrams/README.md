# Diagrams

All UML, data-flow, ER, activity, sequence and deployment diagrams for UniCore.

| Diagram | File |
|---------|------|
| Use case, class, sequence, component, DFD (Level 0 & 1) | [uml/uml_and_dfd.pdf](./uml/uml_and_dfd.pdf) · previews [below](#previews) |
| Sequence: student login and academic dashboard | [sequence/Sequence_diagram.pdf](./sequence/Sequence_diagram.pdf) |
| Activity: student services, exams and results, hostel and outpass, library | [activity/UniCore_Activity_Diagrams.pdf](./activity/UniCore_Activity_Diagrams.pdf) |
| Deployment | [deployment/unicore_deployment_diagram.pdf](./deployment/unicore_deployment_diagram.pdf) |
| ER: full schema, generated from [`code/database/`](../../code/database/) (all 8 schemas) | [er/unicore_er_diagram.pdf](./er/unicore_er_diagram.pdf) · [interactive HTML](./er/unicore_er_diagram.html) |
| ER: conceptual overview | [er/er_diagram.pdf](./er/er_diagram.pdf) |

Regenerate the full ER diagram after a schema change: `python3 docs/diagrams/er/build_er_diagram.py`

---

## Previews

### Use case diagram
![Use case diagram](../website/public/images/use_case_light.png)

### Class diagram
![Class diagram](../website/public/images/class_diagram_light.png)

### Sequence diagram
![Sequence diagram](../website/public/images/seq_light.png)

### Component diagram
![Component diagram](../website/public/images/comp_light.png)

### Data flow diagrams
**Level 0 (context)**

![DFD level 0](../website/public/images/dfd0_light.png)

**Level 1**

![DFD level 1](../website/public/images/dfd1_light.png)
