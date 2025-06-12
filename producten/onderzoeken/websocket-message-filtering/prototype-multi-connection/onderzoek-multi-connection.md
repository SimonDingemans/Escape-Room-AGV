## Meerdere WebSocket connecties

### Context

In de huidige implementatie worden alle componenten in de frontend die luisteren naar WebSocket berichten herlaad bij
ieder bericht dat binnenkomt, ongeacht of het bericht relevant is voor die specifieke component. Dit leidt tot onnodige
re-renders en kan de applicatie prestaties negatief beïnvloeden.

### Onderzoeksresultaten

Uit het prototype is gebleken dat het technisch mogelijk is om meerdere WebSocket connecties te maken vanuit de frontend
naar de backend. Deze aanpak heeft de volgende kenmerken:

#### Voordelen

- **Gerichte updates**: Alleen relevante componenten worden bijgewerkt op basis van het ontvangen bericht.
- **Modulaire opzet**: Betere scheiding van verantwoordelijkheden in de applicatiecode
- **Schaalbaarheid**: Mogelijkheid om verschillende WebSocket endpoints te hebben voor verschillende functionaliteiten

#### Nadelen

- **Verhoogde serverbronnen**: Elke nieuwe connectie verbruikt extra resources op de server
- **Overhead in netwerkverkeer**: Meer connecties betekent meer TCP/IP overhead
- **Complexere state management**: Gegevens uit meerdere bronnen moeten worden samengevoegd

#### Technische implementatie

Het prototype toont aan dat door gebruik te maken van een globale state management oplossing zoals Zustand, gegevens van
meerdere WebSocket connecties kunnen worden opgeslagen en beheerd in een centrale plaats, terwijl de voordelen van
gescheiden connecties behouden blijven.

### Integratie met bestaande architectuur

De oplossing met meerdere WebSocket connecties kan worden geïntegreerd met de huidige frontend architectuur door:

1. Specifieke WebSocket clients te maken voor verschillende functionaliteiten
2. Een centrale state store te gebruiken om gegevens te beheren
3. Componenten alleen te laten luisteren naar de relevante state updates

## Conclusie

Het prototype heeft aangetoond dat het technisch haalbaar is om meerdere WebSocket connecties te implementeren en de
data in een globale state te bewaren. Deze aanpak biedt voordelen voor frontend prestaties en architectuur, maar vraagt
om zorgvuldig ontwerp om de nadelen te minimaliseren.
