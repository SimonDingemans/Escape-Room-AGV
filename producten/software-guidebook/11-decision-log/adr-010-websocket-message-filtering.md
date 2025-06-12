### ADR-010 WebSocket Message filtering

Datum: 2025-05-21

#### Status

Geaccepteerd

#### Context

Momenteel zijn alle onderdelen in de frontend die luisteren naar websocket berichten afhankelijk van alle berichten die
binnen komen. Hierdoor worden al die componenten herladen bij elke keer dat een bericht binnen komt zelfs al zou er
niets anders gerendered worden bij het binnenkomen van dat bericht.

De vraag is hoe de berichten gefiltered kunnen worden zodat er niet alle onderdelen herladen worden en of wij dit kunnen
doen.

#### Afgewogen opties

| Forces                                                                                                | Meerdere websocket connecties | Filtering op component basis |
|-------------------------------------------------------------------------------------------------------|-------------------------------|------------------------------|
| Complexiteit componenten die afhankelijk zijn van een deel van de berichten                           | -                             | ++                           |
| Complexiteit berichten                                                                                | 0                             | 0                            |
| Berichten kunnen gestuurt worden naar de frontend zonder een specifiek id / subject van een component | --                            | +                            |
| Netwerkverkeer                                                                                        | --                            | +                            |
| Gebruik websocket server                                                                              | --                            | ++                           |

#### Beslissing

Op basis van de forces tabel die gemaakt is op basis van twee
onderzoeken ([component filtering](../../onderzoeken/websocket-message-filtering/prototype-component-filtering/onderzoek-component-filtering.md)
en [meerdere websocket connecties](../../onderzoeken/websocket-message-filtering/prototype-multi-connection/onderzoek-multi-connection.md))
besluit het team om gebruik te gaan maken van filtering op component basis.

#### Consequenties

1. **Verbeterde performance in de UI**
    - Alleen componenten waarvoor het bericht relevant is worden opnieuw gerenderd of geüpdatet.

2. **Complexere frontend-logica**
    - Er moet een mechanism worden geïmplementeerd dat bepaalt welke berichten naar welke componenten gaan.
    - Houdt in dat elke component moet aangeven (of subscriben op) welke berichten relevant zijn.

3. **Betere onderhoudbaarheid**
    - Door expliciet te kiezen welke componenten op welke berichten reageren, wordt het makkelijker om dependencies inzichtelijk te maken en te beheren.
    - Dit maakt de applicatie toekomstbestendiger en eenvoudiger uit te breiden.

4. **Vereist aanpassing aan berichtstructuur of routinglogica**
    - Bestaande websockets-berichten moeten worden voorzien van extra metadata (zoals een type, onderwerp, topic/id) zodat er zinvol gefilterd kan worden.

5. **Potentiële foutbronnen in filtering**
    - Foute of ontbrekende filters kunnen ervoor zorgen dat componenten geen (of onjuiste) updates ontvangen.
    - Testen en documentatie van filters is belangrijk.
