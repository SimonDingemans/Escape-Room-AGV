### ADR-007 meerdere pagina's

Datum: 2025-05-13


#### Status

Geaccepteerd

#### Context
We gebruiken websockets en hebben twee verschillende producten die wij opleveren, de editor en de besturing. 
Hiervoor moeten wij de keuze maken of we de twee producten combineren naar een pagina met heel veel render logica 
of dat wij het gesplitst houden.

#### Afgewogen opties

| Forces             | Eén pagina | Meerdere pagina's |
|--------------------|------------|-------------------|
| Modulariteit       | --         | ++                |
| Overzichtelijkheid | -          | ++                |
| Code duplicatie    | +          | 0                 |
| Uitbreidbaarheid   | -          | +                 |

#### Beslissing
Het team kiest ervoor om meerdere paginas te gebruiken, omdat het overzichtelijker is voor de eindgebruiker. Ook 
is het veel makkelijker uit te breiden als er in de toekomst nieuwe functionaliteiten toegevoegd zouden moeten worden.

#### Consequenties

Er moet duidelijk worden aangegeven door het team welke pagina waarvoor is.

