## 📌 Základní definice
**L.O.N.G.I.N. (Logical Orchestration Networked Generative Intelligent Nexus)** je systém založený na **modulární architektuře**, kde jednotlivé moduly spolupracují přes **konektory** pomocí **EventBus** a dalších komunikačních mechanismů. Každý modul má specifickou funkci a lze je kombinovat do větších celků pro komplexní zpracování úloh. 

Hlavní koncepty projektu:
- **Hierarchická struktura modulů** → Modulární rozdělení do 4 úrovní.
- **Konektory s dynamickou validací dat** → Předávání dat mezi moduly.
- **Hybridní komunikační systém** → Kombinuje EventBus, Message Queue a REST API.
- **Asynchronní zpracování** → Zajišťuje škálovatelnost.
- **Správa AI agentů** → Integrace různých AI modelů a řízení jejich workflow.
- **Robustní logování a diagnostika** → Pro sledování a optimalizaci výkonu systému.

## Hlavní moduly a systémy podle úrovně

### 🟢 Moduly 1. stupně (Základní jednotky)

| Název                  | Popis                                                          |
| ---------------------- | -------------------------------------------------------------- |
| **DOMScraper**         | Sleduje změny v DOM, extrahuje obsah z chatu AI asistenta.     |
| **HTTPResponseParser** | Extrahuje odpovědi z HTTP požadavků, zpracovává je.            |
| **FileHandler**        | Ukládá scrapovaná data do souborů podle typu (8 typů).         |
| **FileTypeDetector**   | Rozeznává typy souborů před uložením.                          |
| **QuerySender**        | Odesílá otázky AI asistentovi, spravuje odpovědi.              |
| **AILoader**           | Přidává nové AI asistenty pomocí URL a skeneru.                |
| **LocalAILoader**      | Přidává nové AI asistenty ze souborového systému (path).       |
| **ActiveAISelector**   | Umožňuje výběr aktivního AI asistenta.                         |
| **TextSelector**       | Umožňuje výběr části textu k odeslání (včetně ručního zadání). |
| **UIComponent**        | Základní UI komponenty (tlačítka, pole, seznamy).              |
| **URLStorage**         | Ukládá URL adresy AI asistentů pro načítání.                   |
| **HTMLScanner**        | Skenuje HTML elementy potřebné k interakci s AI asistentem.    |
| **LogHandler**         | Základní komponenta pro logování událostí a chyb.              |
| **ErrorCatcher**       | Try-catch wrapper pro detekci a záznam chyb.                   |
| **ContextDetector**    | Zjišťuje maximální velikost kontextového okna nového AI asistenta v počtu tokenů. |
| **LimitChecker**       | Sleduje limity free verze AI asistenta a dostupné API možnosti. |

### 🟡 Moduly 2. stupně

| Název                  | Popis                                                                   |
| ---------------------- | ----------------------------------------------------------------------- |
| **ScrapManager**       | Koordinuje DOMScraper, HTTPResponseParser a FileHandler, validuje data. |
| **FileOrganizer**      | Třídí soubory podle typu a nastavuje pravidla pro ukládání.             |
| **QueryManager**       | Spravuje a směruje dotazy mezi asistenty.                               |
| **AIManager**          | Spojuje AILoader a LocalAILoader, spravuje seznam AI agentů.            |
| **SelectionManager**   | Koordinuje ActiveAISelector a TextSelector pro přesný výběr.            |
| **ErrorLogger**        | Centralizované logování chyb se stavovými kódy.                         |
| **WorkflowManager**    | Spravuje a řídí workflow mezi jednotlivými AI asistenty.                |
| **InstructionManager** | Ukládá a distribuuje instrukce pro různé workflow části.                |

### 🔵 Moduly 3. stupně

| Název                     | Popis                                                           |
| ------------------------- | --------------------------------------------------------------- |
| **AssistantOrchestrator** | Řídí více AI agentů, distribuuje dotazy, kombinuje odpovědi.    |
| **StorageController**     | Centrálně spravuje uložené soubory, umožňuje jejich indexaci.   |
| **QueryRouter**           | Řídí směřování dotazů mezi asistenty podle pravidel.            |
| **AIRegistry**            | Uchovává a spravuje seznam aktivních a dostupných AI asistentů. |
| **WorkflowEditor**        | Umožňuje vizuální úpravu workflow ve formě diagramu.            |
| **AutoWorkflowOptimizer** | Automaticky optimalizuje workflow pro efektivnější zpracování.  |
| **SystemLogViewer**       | Poskytuje UI pro prohlížení logů a chyb.                        |

### 🔴 Moduly 4. stupně

| Název                    | Popis                                                                 |
| ------------------------ | --------------------------------------------------------------------- |
| **CoreSystem**           | Zajišťuje kompletní orchestraci skenování, dotazování a ukládání dat. |
| **AIIntegrationManager** | Spojuje různé metody přidávání AI asistentů a jejich načítání.        |
| **WorkflowOrchestrator** | Plná kontrola nad workflow, propojuje jednotlivé části.               |
| **SystemMonitor**        | Systémový dohled nad všemi operacemi a výkonem systému.               |

### ⚫ Moduly 5. stupně

| Název                  | Popis                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| **GlobalOrchestrator** | Nejvyšší úroveň řízení celého systému, zajišťuje koordinaci všech modulů. |
| **AIHypervisor**       | Pokročilá správa AI agentů, optimalizace výkonu a distribuce úloh.       |
