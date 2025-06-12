### ADR-008 State management editor

Datum: 2025-05-13

#### Status

Geaccepteerd

#### Context

Bij de editor is er een formulier dat ingevuld moet worden, na het invullen moet de data uit het formulier opgeslagen
worden in een ander component waarvan onduidelijk is waar dit component staat in relatie met het formulier.
De vraag is hoe de data bij het andere component moet komen.

#### Afgewogen opties

| Forces                   | Prop Drilling | Context API | Redux | Zustand |
|--------------------------|---------------|-------------|-------|---------|
| Kennis team              | ++            | +           | 0     | -       |
| Documentatie             | -             | 0           | +     | +       |
| Gemakkelijk te leren     | ++            | +           | 0     | +       |
| Goed geordend            | --            | -           | ++    | ++      |
| Eenvoudigheid in gebruik | -             | +           | 0     | +       |

#### Beslissing

Het team heeft besloten om Zustand te gebruiken, omdat het team de eenvoudigheid in het leren en gebruiken van Zustand
belangrijker zijn dan de aanwezige kennis.

#### Consequenties

Het team moet Zustand leren.
