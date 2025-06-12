### ADR-006 UI in TouchDesigner

Datum: 2025-05-07

#### Status

Geaccepteerd

#### Context

De opdrachtgever wilde dat het team ging onderzoeken of het mogelijk is om in TouchDesigner een UI te maken waarmee een
scenario ontwikkeld kan worden. De opdrachtgever wil weten of het makkelijker of beter georganiseerd is in TouchDesigner
of via een lokale website.

#### Afgewogen opties

| Forces                                          | TouchDesigner | Lokale website |
|-------------------------------------------------|---------------|----------------|
| Kan een UI maken                                | +             | ++             |
| Kennis team                                     | --            | ++             |
| Kennis opdrachtgever                            | ++            | --             |
| Kan de TD components voor de hardware aansturen | ++            | +              |
| Kan de scenario's opslaan                       | ?             | ++             |
| Git ondersteuning                               | --            | ++             |
| Debugging en testing                            | -             | ++             |
| Kosten                                          | --            | ++             |

#### Beslissing

Het team kiest voor de lokale website omdat het team daar meer kennis over heeft en gemakkelijker informatie kan
opzoeken. Ook is het niet mogelijk om versie beheer via Git te gebruiken met TouchDesigner bestanden, omdat deze altijd
[merge conflicten veroorzaken](https://forum.derivative.ca/t/git-compatible-toe-tox-files/298851/23). Verder heeft
TouchDesigner functies die alleen bij de betaalde versie gebruikt kunnen worden, terwijl een lokale volledig gratis is.

#### Consequenties

Het team moet een website maken. <br />
Voor de opdrachtgever is het product minder goed onderhoudbaar zonder een ander team.
