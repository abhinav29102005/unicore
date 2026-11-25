# UniCore diagrams

## Eight UML diagrams for UCS503

The end-semester course contents list these eight types. Each current-system diagram has its own folder and PDF.

| Type | PDF | What it shows |
|---|---|---|
| Use case | [Use-case diagram](./use-case/UniCore_use_case_diagram.pdf) | Student, faculty, admin and staff actions |
| Activity and swimlane | [Activity diagram](./activity/UniCore_activity_diagram.pdf) | Student sign-in and dashboard read across browser, API and database |
| Class | [Class diagram](./class/UniCore_class_diagram.pdf) | Representative persisted entities in the Java backend |
| Sequence | [Sequence diagram](./sequence/UniCore_sequence_diagram.pdf) | Sign-in and student dashboard request order |
| Collaboration | [Collaboration diagram](./collaboration/UniCore_collaboration_diagram.pdf) | Numbered messages between dashboard objects |
| State chart | [State-chart diagram](./state-chart/UniCore_state_chart_diagram.pdf) | Server-side session states and invalidation |
| Component | [Component diagram](./component/UniCore_component_diagram.pdf) | React, Spring Security, controllers, repositories and database |
| Deployment | [Deployment diagram](./deployment/UniCore_current_deployment_diagram.pdf) | Static site and Java API deployment boundary |

These diagrams describe the code in `code/frontend` and `code/backend` as of 25 November 2026. The deployment diagram labels the public Java backend as unverified; GitHub Pages hosts static files only.

## Additional course diagrams and earlier material

- [DFD and earlier UML bundle](./uml/uml_and_dfd.pdf) (includes the Level 0 and Level 1 DFDs)
- [Schema-generated ER overview](./er/unicore_er_overview.pdf) and [full ER reference](./er/unicore_er_diagram.pdf)
- [Earlier activity set](./activity/UniCore_Activity_Diagrams.pdf)
- [Earlier sequence diagram](./sequence/Sequence_diagram.pdf)
- [Earlier deployment diagram](./deployment/unicore_deployment_diagram.pdf), which describes the retired Worker/Turso architecture and should not be used for the current-system presentation

The earlier diagrams are retained for traceability. Use the eight linked PDFs above for this evaluation.
