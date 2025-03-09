## ⚙️ Workflow instalace

### 🛠️ Instalační proces
Instalace bude probíhat pomocí dvou hlavních skriptů:
- **installogin.exe** – ověří, zda je možné spustit instalační skript installWorkflow.py.
- **installWorkflow.py** – hlavní instalační skript, který provede všechny kroky instalace.

### 🔽 Průběh instalace
1️⃣ **Spuštění installogin.exe**
   - Ověří, zda je možné spustit installWorkflow.py.
   - Zkontroluje požadované knihovny a závislosti.
   - Pokud nejsou dostupné, nainstaluje nebo aktualizuje je.
   - Po dokončení se spustí installWorkflow.py.

2️⃣ **Načtení instalačních informací**
   - Prochází složky s moduly a jejich instalačními soubory.
   - Ověří všechny závislosti a strukturu systému.

3️⃣ **Instalace modulů a podmodulů**
   - Každý modul nainstaluje své závislosti.
   - Moduly informují o svých podmodulech.
   - Proces pokračuje rekurzivně, dokud nejsou načteny všechny součásti.

4️⃣ **Kontrola návazností celého systému**
   - Ověření, že všechny propojené moduly a jejich konektory správně komunikují.
   - Logování případných chyb a problémů.

5️⃣ **Vytvoření hlavního spouštěcího souboru**
   - Generování longin.exe nebo longin.bat (podle vhodnosti pro Windows).

6️⃣ **Test funkčnosti**
   - Spuštění základních testů pro ověření správné instalace.

### ✅ Validace instalace modulů
1️⃣ **Kontrola integrity souborů**
   - Ověření, že všechny potřebné soubory jsou přítomné a neporušené (checksum/hash validace).
   - Kontrola přístupových práv k souborům.

2️⃣ **Ověření závislostí**
   - Každý modul obsahuje soubor dependencies.json, který definuje požadované knihovny.
   - Instalační systém ověří, zda jsou všechny závislosti nainstalované.
   - Pokud některé chybí, nabídne jejich automatickou instalaci.
   - Pokus není k nalezení v PATH přidá jí do PATH.
   - Pokud ani potom nejde nalézt odinstaluje ji a znovu nainstaluje a přidá do PATH

3️⃣ **Testovací inicializace modulů**
   - Po instalaci se každý modul spustí v testovacím režimu.
   - Modul provede interní autotest (např. ověření připojení ke konektorům, základní funkčnost).
   - Pokud test selže, instalace se pozastaví a nabídne uživateli možnosti řešení.

4️⃣ **Ověření komunikace mezi moduly**
   - Po úspěšné inicializaci se provede test komunikace mezi moduly přes EventBus.
   - Každý modul musí správně odesílat a přijímat zprávy podle specifikace.

5️⃣ **Logování a diagnostika**
   - Každý krok instalace a validace bude zaznamenán do instalačního logu.
   - Pokud dojde k chybě, uživateli se zobrazí diagnostický panel s možnostmi opravy.

---
🔄 Tento soubor bude průběžně aktualizován s novými požadavky a detaily k implementaci.
