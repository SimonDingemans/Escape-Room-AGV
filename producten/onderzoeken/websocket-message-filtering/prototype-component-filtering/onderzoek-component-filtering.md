## Component Filtering

### Context

In de huidige implementatie ontvangen alle componenten in de frontend elk binnenkomend WebSocket-bericht, ongeacht of
het relevant is voor die component. Dit leidt tot onnodige re-renders en inefficiënt gebruik van resources. De berichten
moeten globaal opgeslagen worden zodat er geen problemen zijn met prop drilling.

### Onderzoeksresultaten

Uit het prototype blijkt dat het mogelijk is om binnen een enkele WebSocket connectie berichten te filteren op basis van
bijvoorbeeld berichttype, categorie of unieke identifiers. Hierdoor kunnen alleen de componenten die een specifiek
bericht nodig hebben, worden bijgewerkt.

#### Voordelen

- **Gerichte updates**: Alleen relevante componenten worden bijgewerkt op basis van het ontvangen bericht.
- **Simpel gebruik in componenten**: Componenten kunnen simpel kiezen op welke berichten ze afhankelijk willen zijn.
- **Betere schaalbaarheid**: Door filtering aan de clientzijde kan de applicatie efficiënt blijven werken bij een
  groeiend aantal componenten en berichten.

#### Nadelen

- **Berichtfiltering vereist in client**: Er is een mechanisme nodig om de berichten te koppelen aan een id / subject
  van een component.
- **Berichten zonder id / subject van het component niet te koppelen**: Berichten die verstuurd worden naar de client
  komen wel aan zonder errors maar kunnen niet gekoppeld worden aan de juiste componenten.

#### Technische implementatie

In het prototype worden berichten voorzien van metadata, zodat ze eenvoudig kunnen worden gefilterd. Een centrale
handler ontvangt de berichten, past filtering toe en werkt alleen die delen van de state bij die relevant zijn voor de
betreffende componenten. Componenten subscriben specifiek op relevante state-segmenten.

### Integratie met bestaande architectuur

Component filtering kan als volgt worden geïntegreerd:

1. Verrijk alle WebSocket-berichten met voldoende metadata om filtering mogelijk te maken.
2. Implementeer een centrale hub of handler die berichten ontvangt en koppelt aan de juiste componenten.
3. Laat frontend componenten subscriben op alleen de state waarop zij moeten reageren.

## Conclusie

Het prototype laat zien dat component filtering technisch goed haalbaar is. Door filtering aan de clientkant te
organiseren en berichten te voorzien van duidelijke metadata, kunnen frontend componenten veel gerichter en efficiënter
reageren op WebSocket-communicatie.