### ADR-005 TouchDesigner interfacing

Datum: 2025-05-06

#### Status

Geaccepteerd

#### Context

TouchDesigner kan aangestuurd worden via websockets, hierbij kunnen verschillende node acties uitgevoerd worden op basis
van de websocket message.

#### Afgewogen opties

| Forces                                           | Node | Deno | Java + Spring Boot |
|--------------------------------------------------|------|------|--------------------|
| Server is licht om te draaien                    | +    | +    | -                  |
| Ondersteund websocket server zonder dependencies | --   | ++   | --                 |
| Kennis van het team                              | 0    | 0    | ++                 |
| Documentatie                                     | 0    | -    | +                  |
| Tutorials beschikbaar                            | ++   | -    | ++                 |

#### Beslissing

Voor de opdrachtgever is het belangrijk dat de server licht is om te draaien zodat ze de server in combinatie met
TouchDesigner op een laptop kan draaien. Het is voor het team belangrijk dat er genoeg documentatie en tutorials
beschikbaar zijn zodat de benodigde kennis makkelijk opgedaan kan worden.

Vanwege deze redenen in combinatie met de scores uit de forces tabel kiest het team voor Node.

#### Consequenties

Het team moet leren programmeren in Node.

Het team moet een library gebruiken voor de websocket server.



