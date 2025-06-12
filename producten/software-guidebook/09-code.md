# Code

In dit hoofdstuk worden opmerkelijke stukken code, belangrijke patronen en de code structuur toegelicht.
Eerst wordt de code inrichting per onderdeel van het systeem toegelicht.
Daarna worden opmerkelijke stukken code en/of belangrijke patronen toegelicht.
Dit hoofdstuk gaat alleen over het tweede walking skeleton.

## Code Structuur

Per onderdeel wordt uitgelegd hoe de folder- of node-structuur in elkaar zit.

### Backend

De backend is opgebouwd uit een overzichtelijke folder structuur die de functionaliteiten logisch scheidt:

- `config`: In deze folder staat de configuratie voor de database.
- `mediaFiles`: In deze folder komen alle bestanden die naar de backend verstuurd zijn.
- `domain`: In de domain folder staat voor elk domein object een folder `domein-object` met daarin de bestanden die de classes en queries van het domein object bevatten.
- `temp-uploads`: 
    Deze folder bestaat pas zodra de backend voor het eerst een bestand ontvangen heeft. 
    Na het verwerken van de request wordt het bestand verplaatst naar de folder `mediaFiles` in de juiste subfolder of wordt het bestand verwijderd.
- `routes`: Bevat de API endpoints van de backend, vanuit hier wordt de logica van de backend bestuurt.
- `utils`: In deze folder staan de gedeelde functies die gebruikt worden door de rest van de backend.
- `middleware`: In deze folder staat de middleware die gebruikt wordt voor het verwerken van bestanden.

De backend fungeert als centrale hub voor communicatie tussen alle componenten van het systeem via WebSocket verbindingen en HTTP API's.

### Frontend

De code in frontend is opgedeeld in een aantal belangrijke folders binnen de `src` folder:
- `components`: Hierin staan componenten die door meerdere componenten gebruikt worden.
- `pages`: Hierin staan de pagina's van de applicatie. De pages folder komt overeen met de paden van de url.
- `stores`: Hierin staan de stores waarin variabelen globaal opgeslagen kunnen worden.

### TouchDesigner

In TouchDesigner staan meerdere nodes die vrijwel allemaal integraal zijn voor de werking van het systeem. Voor de communicatie zijn de `websocket`, `websocket_callbacks`, `websocket_connection_info`, `autostart` en `time_store` nodes essentieel voor het functioneren van het systeem.

Het ophalen van apparaten gebeurt via referenties vanuit de `websocket_callbacks` node naar de `audiodevs1`, `monitors1` en `videodevs1` nodes, die respectievelijk audio-apparaten, monitoren en video-apparaten detecteren.

Voor het maken van de nodes waarmee de bestanden worden afgespeeld, worden de `template_audio` en `template_video` templates gebruikt om kopieën van te maken. 
Deze template nodes worden gekopieerd en gekoppeld aan de dynamisch gegenereerde nodes die gebaseerd zijn op de aanwezige apparaten die worden opgehaald via de eerder genoemde apparaat-detectie nodes.
De nieuwe base nodes die hierbij gemaakt worden zullen beginnen met de prefix die hoort bij het bestandstype, bijvoorbeeld `movie_` voor een video. 

Binnen de base nodes mogen extra nodes toegevoegd worden tussen de input en output nodes. 
Bijvoorbeeld bij videos zijn de input nodes `moviefilein1` en `audiomovie1`, er mogen nodes toegevoegd worden tussen deze input en de `video` en `audio` output.

## WebSockets

Het WebSocket systeem vormt de ruggengraat voor real-time communicatie tussen de backend, frontend en TouchDesigner.
Bij alle stukken code die getoond worden, staat erbij in welk component, bestand of node dit is.

### Dual Protocol Message Handling

Het systeem handelt zowel JSON als binaire berichten af binnen één message handler:

```javascript
// backend/utils/wsUtils.js
// In functie initializeWebSocketServer
try {
  // JSON message
  await handleJsonMessage(message, ws);
  return;
} catch (e) {
  // Message not JSON, assume it is binary
}

handleBinaryMessage(message, ws);
```

JSON wordt gebruikt voor commando's en status updates, terwijl binaire data specifiek voor bestandsoverdracht naar TouchDesigner wordt gebruikt.

### Role-Based Client Management

Clients worden gemanaged via een Map waarbij elke rol slechts één actieve connectie kan hebben:

```javascript
// backend/utils/wsUtils.js
const clients = new Map(); // role -> websocket connection

// Singleton per role - nieuwe connectie overschrijft bestaande
// In functie handleJsonMessage
if (json.type === 'role') {
  const validRole = roles.find(role => role === json.role)

  // All clients must have a valid role
  if (validRole) {
    clients.set(json.role, ws)
  } else ws.close();
  return;
}
```

Geldige rollen zijn: `OPERATOR`, `BACKUP_TEAM`, `TOUCH_DESIGNER`, `EDITOR`.
Clients zonder geldige rol worden automatisch afgesloten.

## File Synchronization met Binary Protocol

Het systeem synchroniseert mediabestanden tussen de backend en TouchDesigner via een binair protocol.
Dit protocol is ontworpen om zowel metadata als bestandsinhoud efficiënt in één gestructureerd bericht over te dragen.

#### Protocol Structuur

Het binaire protocol gebruikt een length-prefixed indeling waarbij metadata en bestandsdata worden gecombineerd in één buffer.
De structuur bestaat uit drie onderdelen:
- Een 4-byte header die de lengte van de metadata aangeeft
- JSON metadata met bestandsinformatie (naam, eventId, mediaType)
- De daadwerkelijke bestandsinhoud als binaire data

### Backend Implementatie

De backend construeert berichten door eerst de metadata naar JSON te serialiseren en vervolgens een buffer te creëren die alle componenten bevat.
De metadata lengte wordt als 32-bit little-endian integer aan het begin geplaatst, gevolgd door de metadata zelf en tenslotte de bestandsdata.

### TouchDesigner Verwerking

TouchDesigner ontvangt de binaire berichten en parseert deze door eerst de metadata lengte uit te lezen, vervolgens de JSON metadata te extraheren en te deserializeren, en tenslotte de bestandsdata te isoleren.
Op basis van het mediaType (movie/audio) wordt het bestand opgeslagen en worden corresponderende TouchDesigner operators aangemaakt.

Dit protocol waarborgt dat TouchDesigner alle benodigde informatie ontvangt om de nodes aan te maken waarin de media bestanden verwerkt zijn.

### Automatic Synchronization Workflow

Bij verbinding initieert TouchDesigner automatisch een synchronisatie:

1. **Connection**: TouchDesigner registreert zich met rol `TOUCH_DESIGNER`
2. **Sync Request**: Stuurt `{"type": "synchronize"}` naar backend
3. **File Transfer**: Backend stuurt alle niet-gesynchroniseerde bestanden via binary protocol
4. **Acknowledgment**: TouchDesigner bevestigt ontvangst per bestand via `{"type": "synchronizeSuccess", "eventId": ...}`
5. **Database Update**: Backend markeert bestanden als gesynchroniseerd. Zo wordt de kolom `synchronized` in de rij van het event in de tabel `Events` geupdated naar `synchronized = 1`

### TouchDesigner Node Generation

Node namen worden gegenereerd via `fixFileName(fileName)` functie die spaties en speciale karakters vervangt met underscores voor TouchDesigner compatibiliteit.

TouchDesigner genereert dynamisch operators voor ontvangen media:

```python
#  /project1/websocket_callbacks
#  In functie onReceiveText

if mediaType == 'movie':
    video = op('/project1').copy(op('template_movie'), name='movie_' + operator_name)
    video.op('moviefilein1').par.file = path
elif mediaType == 'audio':
    audio = op('/project1').copy(op('template_audio'), name='audio_' + operator_name)  
    audio.op('audiofilein1').par.file = path
```

### Synchronization Limitations

De huidige implementatie van het synchronisatie systeem heeft enkele belangrijke beperkingen:

**One-Way Synchronization**: Synchronisatie werkt alleen van database naar TouchDesigner.
Als operators handmatig worden verwijderd uit TouchDesigner blijft de database aangeven dat het event gesynchroniseerd is (`synchronized = 1`).
Dit leidt tot inconsistentie waarbij de database denkt dat content beschikbaar is in TouchDesigner terwijl deze feitelijk ontbreekt.

**One-Time Synchronization**: Er wordt gesynchroniseerd op het moment dat TouchDesigner is gekoppeld aan de backend.
Wijzigingen aan events (bestandsnaam, timing, parameters) worden niet automatisch doorgevoerd naar TouchDesigner - er is geen mechanisme voor updates van bestaande operators.
Er bestaat geen automatische cleanup van oude operators wanneer events worden verwijderd uit de database. Dit kan leiden tot "orphaned" operators in TouchDesigner.

## State Management

De globale variabelen in de frontend worden opgeslagen in [zustand](./11-decision-log/adr-008-state-management-editor.md) stores. 
Hierin worden de states van de websocketverbinding en het huidige scenario opgeslagen. 
Elk component kan functies of eigenschappen van deze states opgvragen.

Een limitatie van de huidige implementatie is dat bij het refreshen van de pagina de data uit de stores verloren gaan.
Dit kan opgelost worden door een deel van de store op te slaan in de browser.

## Timer

De timer is een centraal component die de uitvoering van escape room scenario's regelt.
De timer leeft volledig in de backend en communiceert via WebSocket berichten met de frontend over de huidige staat.

Hieronder worden enkele opmerkelijke patronen van de timer toegelicht.

### Singleton Pattern
De timer wordt geïmplementeerd als een globale `timer` variabele in de backend die als singleton fungeert.
Er kan slechts één timer tegelijk actief zijn - bij het starten van een nieuw scenario wordt een eventueel bestaande timer automatisch gestopt.

```javascript
// backend/routes/escapeRoom.js

let timer = null

// In functie startTimer
timer = {
  interval: null,
  scenarioId,
  currentSeconds,
  events: sortedEvents,
  playingEvents: [],
  playedEvents: [],
  isPaused: false,
  speed: speed
};
```

### Event State Machine 
Events doorlopen een state machine in de timer met drie lijsten:
- `events`: Nog uit te voeren events (gesorteerd chronologisch)
- `playingEvents`: Momenteel actieve events
- `playedEvents`: Voltooide events

Events worden real-time verplaatst tussen deze lijsten op basis van `starting_seconds` en `ending_seconds`.

### Reverse Iteration Pattern
Bij het verwerken van events in de state machine wordt bewust backwards door de arrays geïtereerd (`for (let i = array.length - 1; i >= 0; i--)`).
Dit voorkomt index problemen wanneer items tijdens iteratie uit de array worden verwijderd via `splice()`.