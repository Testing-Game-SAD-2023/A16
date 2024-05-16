# Gruppo A16-2024
Componenti:
- Antonio Bocchetti - M63/1259
- Gianluigi Erra - M63/1261
- Antonio Savino - M63/1318
- Stefano Violante - M63/1263
  
# Guida all'installazione

Per installare correttamente l'applicazione, seguire attentamente i seguenti passaggi:

1. Scaricare Docker Desktop dal seguente [link](https://www.docker.com/products/docker-desktop/).

    Nel caso non sia la prima installazione, è necessario effettuare la disinstallazione, quindi utilizzare `uninstaller.bat` mentre si ha in esecuzione Docker: in questo modo si elimina qualunque file presente su Docker. In caso di errore "136 Docker desktop - unexpected wsl error" sarà necessario eseguire il comando `wsl --shutdown` nel terminale ed eseguire il riavvio. Se l'errore persiste, allora è consigliabile installare o aggiornare WSL all'ultima versione con il comando `wsl --install` (o con `wsl --update`).

2. Una volta scaricata la cartella del progetto, avviare lo script `installer.bat` su Windows. Su MacOS è necessario eseguire il comando `chmod +x installermac.sh` nella cartella in cui è presente il file `installermac.sh` e poi eseguire `./installermac.sh` per avviarlo.

3. Alla fine dell'installazione si avrà:
    - la creazione della rete global-network comune a tutti i container;
    - la creazione dei volumi VolumeT8 e VolumeT9 per i task 1-8 e 1-9, rispettivamente;
    - la creazione dei singoli container nell'applicazione Docker desktop.
    - la configurazione del container *manvsclass-mongo db-1*; in particolare, lo script esegue in automatico le seguenti operazioni:
        - `use manvsclass`
        - `db.createCollection(ClassUT)`
        - `db.createCollection(interaction)`
        - `db.createCollection(Admin)`
        - `db.createCollection(Operation)`
        - `db.ClassUT.createIndex( difficulty: 1 )`
        - `db.Interaction.createIndex( name: text, type: 1 )`
        - `db.interaction.createIndex( name: text )`
        - `db.Admin.createIndex(username: 1)`

Per ulteriori dettagli sull'utilizzo dell'applicazione, si prega di fare riferimento alla sezione seguente.

---

# Guida all'utilizzo

Una volta installata correttamente l'applicazione, seguire le istruzioni seguenti:

## Avvio dei container

Per utilizzare l'applicazione, è necessario avviare tutti i container ad eccezione di `ui gateway`, che dovrà essere avviato per ultimo. L'applicazione è raggiungibile sulla porta `:80`.

## Esposizione dell'applicazione su un indirizzo pubblico

Per esporre l'applicazione su un indirizzo pubblico, si rimanda alla documentazione dei colleghi del gruppo A10 ragggiungibile al seguente [link](https://github.com/Testing-Game-SAD-2023/A10-2024).

---

# Guida alle modifiche al codice

Se è necessario modificare il codice dell'applicazione, seguire attentamente i seguenti passaggi:

1. Recarsi nell'applicazione Docker.
2. Aprire la sezione relativa ai containers.
3. Selezionare tutti i containers relativi ai file modificati.
4. Effettuare la delete di tali containers.
5. Aprire la sezione images.
6. Selezionare le immagini relative ai file modificati.
7. Effettuare l'eliminazione di tali immagini.
8. Recarsi sull'IDE utilizzato ed aprire il terminale integrato della cartella in cui è presente il file `pom.xml` relativo ai file modificati.
9. Eseguire il comando `mvn clean package`.
10. Fare clic sul tasto destro sul file `docker-compose.yml` e selezionare "compose up".
11. Riavviare i container.

---

# Problematiche di utilizzo

Di seguito sono elencate alcune delle problematiche riscontrate durante l'utilizzo dell'applicazione al fine di agevolarne l'utilizzo per i gruppi successivi.

## Versione di Ubuntu
Durante le varie installazioni, potrebbe capitare che Ubuntu aggiorni le proprie versioni facendo si che le installazioni non vadano a buon fine. Questo problema si è verificato, in particolare, nel task T1, dove nel Dockerfile avevamo "FROM ubuntu:latest", che installa l'ultima verisone disponibile di Ubuntu.
Per risolvere tale bug abbiamo specificato la versione da utilizzare, correggendo in "FROM ubuntu:18.04".

## Cache del browser

Pulendo la cache del browser, è possibile garantire che ogni modifica apportata al codice sorgente o alle risorse dell'applicazione sia immediatamente visualizzata nel browser. La cache del browser può causare problemi di compatibilità e pulirla semplifica il processo di debug, consentendo agli sviluppatori di identificare e risolvere rapidamente i bug senza dover preoccuparsi di eventuali caching persistenti che potrebbero mascherare il problema.

## Porte già in uso

Durante l'avvio dell'applicazione, potrebbe verificarsi un problema in cui alcuni container non si avviano correttamente, mostrando un messaggio di errore relativo alla porta già in uso. Un esempio comune potrebbe riguardare il container T4, poiché la porta 3000 è comunemente utilizzata dal processo `MySQL80`. In questo caso, è necessario aprire la schermata dei servizi attivi su Windows per individuare e terminare il processo che sta attualmente utilizzando la porta in questione. In alternativa, è possibile risolvere questo problema modificando la porta del container in questione per evitare conflitti.

## 502 Bad Gateway

Occasionalmente, anche dopo che tutti i container sono stati avviati con successo, la pagina web potrebbe visualizzare un messaggio di errore del tipo `502 Bad Gateway`. Una possibile ragione dietro questo tipo di errore potrebbe essere correlata alla rapidità con cui si tenta di accedere all'applicazione web subito dopo il riavvio dei container. In questi casi, la piattaforma potrebbe richiedere del tempo per completare il processo di avvio e stabilire la connessione corretta tra i vari componenti dell'applicazione. Attendere alcuni istanti prima di tentare di accedere all'applicazione può spesso risolvere il problema. Tuttavia, se l'errore persiste nonostante l'attesa, è consigliabile effettuare il riavvio di Docker.

# Video Dimostrativi

# Modalità "Sfida un Robot"

https://github.com/Testing-Game-SAD-2023/A16/assets/120009337/c95dc0d8-3248-4825-a690-756e39fda947

# Modalità "Sfida tutti i Robot"



# Modalità "Allenamento"

# Testing con Selenium
Abbiamo testato l'applicazione anche utilizzando il programma Selenium per effettuare testing automatizzato.

## Modalità "Sfida un Robot"

https://github.com/Testing-Game-SAD-2023/A16/assets/120009337/7792907a-9e0a-4b0b-9fdd-8b79e97b70b3

## Modalità "Sfida tutti i Robot"



https://github.com/Testing-Game-SAD-2023/A16/assets/120009337/1a5156aa-debd-4f3e-80c7-dff67919142f

