var turno = 0; // numero di turni giocati fino ad ora
var perc_robot = '0'; // percentuale di copertura del robot scelto

  //ricezione di CUT e game info
$(document).ready(function() {
  var idUtente = parseJwt(getCookie("jwt")).userId;
  var idPartita = localStorage.getItem("gameId");
  var idTurno = localStorage.getItem("roundId");
  var nameCUT= localStorage.getItem("classe");
  var robotScelto = localStorage.getItem("robot");
  var difficolta = localStorage.getItem("difficulty");

  if(idUtente == null || idPartita == null || idTurno == null || nameCUT == null || robotScelto == null) window.location.href = "/main";

  $.ajax({
    url: "http://localhost/api/receiveClassUnderTest",
    type: "GET",
    data: { 
      idUtente: idUtente,
      idPartita: idPartita,
      idTurno: idTurno,
      nomeCUT: nameCUT,
      robotScelto: robotScelto,
      difficolta: difficolta
    },
    dataType: "text",
    success: function(response) {
      // Ricezione avvenuta con successo
      console.log(response);
      //A16 - INIZIO PROVOLA
      // Aggiungi i campi e il titolo iniziali alla finestra modale
      var modal2Content=document.querySelector("#infoModal .modal2-content");
      // Aggiungi il titolo
      var titleElement = document.createElement("h2");
      titleElement.classList.add("modal2-title");
      titleElement.textContent = "GAME INFO";
      modal2Content.insertBefore(titleElement, modal2Content.firstChild);
      //A16 - FINE PROVOLA
      // Associa le informazioni ricevute ai campi della finestra modale
      var idUtenteElement = document.createElement("p");
      idUtenteElement.textContent = "UserID: " + idUtente;
      modal2Content.appendChild(idUtenteElement);

      var idPartitaElement = document.createElement("p");
      idPartitaElement.textContent = "GameID: " + idPartita;
      modal2Content.appendChild(idPartitaElement);

      var idTurnoElement = document.createElement("p");
      idTurnoElement.textContent = "Turno: " + idTurno;
      modal2Content.appendChild(idTurnoElement);

      var robotSceltoElement = document.createElement("p");
      robotSceltoElement.textContent = "Robot: " + robotScelto;
      modal2Content.appendChild(robotSceltoElement);

      var difficoltaElement = document.createElement("p");
      difficoltaElement.textContent = "Livello: " + difficolta;
      modal2Content.appendChild(difficoltaElement);
      // Aggiorna il contenuto dell'editor laterale con il contenuto ricevuto
      console.log(JSON.parse(response).class);
      sidebarEditor.setValue(JSON.parse(response).class);
    },    
    error: function() {
      // Gestione dell'errore
      console.log("Errore durante la ricezione del file ClassUnderTest.java");
    }
  });
});
  //funzione handler del tasto di storico
  var storico = document.getElementById("storico");
  storico.addEventListener("click", function(){
    document.getElementById('loading-editor').style.display = 'block'; //A16 - AGGIUNTO
    if(turno == 0){
      document.getElementById('loading-editor').style.display = 'none';//A16 - AGGIUNTO
      async function valRob() {             
        try {
          let response = await fetch('http://localhost:3000/robots?testClassId='+localStorage.getItem("classe")+'&type='+localStorage.getItem("robot")+'&difficulty='+localStorage.getItem("difficulty"), 
          { method: 'GET' });
          if (!response.ok) {
            throw new Error('Richiesta risultati robot non andata a buon fine');
          }
          let data = await response.json();
          perc_robot = data.scores;
        } catch (error) {
          console.error('Error:', error);
        }
        alert("Non esiste ancora uno storico dei test\nPercentuale di copertura da battere: "+perc_robot);
      }

      valRob();
    }
    else{
      document.getElementById('loading-editor').style.display = 'none';
      var dastampare = "Percentuale di copertura da battere: " + perc_robot + "\n";
      var testi = "\n";

      async function fetchTurns(turno) {
        for(var i=1; i<=turno; i++){
          if(localStorage.getItem("gameId") == "null"){
            var val = parseInt(localStorage.getItem("turnId"))-turno+i;
          }
          else{
            var val = parseInt(localStorage.getItem("turnId"))-turno+(i-1);
          }
          
          try {
            let response = await fetch('http://localhost:3000/turns/'+val.toString(), { method: 'GET' });
            if (!response.ok) {
              throw new Error('Richiesta risultati turno non andata a buon fine');
            }
            let data = await response.json();
            if(data.isWinner)
              dastampare += "Tentativo " + i.toString() + ": Vittoria\n" + "Percentuale di copertura ottenuta: " + data.scores + "\n";
            else
              dastampare += "Tentativo " + i.toString() + ": Sconfitta\n" + "Percentuale di copertura ottenuta: " + data.scores + "\n";
            console.log(data.scores);
          } catch (error) {
            console.error('Error:', error);
          }

          try{
            let response = await fetch('http://localhost:3080/tests/'+val.toString() + '/Test' + localStorage.getItem("classe"), { method: 'GET' });
            if (!response.ok) {
              throw new Error('Richiesta risultati turno non andata a buon fine');
            }
            let data = await response.text();
            testi += "Codice di test sottoposto al tentativo " + i.toString() + ":\n" + data + "\n\n";
          } catch (error){
            console.error('Error:', error);
          }

        }
        consoleArea.setValue(dastampare+testi);
        console.log(dastampare);
      }

      fetchTurns(turno);
    }
  });

//esecuzione ricevendo XML da T7 e mandando partita a T4
var runButton = document.getElementById("runButton");
runButton.addEventListener("click", function() {
  //   $(document).ready(function() {
  //   $.ajax({
  //     url: "http://localhost:80/getResultXml",
  //     type: "GET",
  //     dataType: "text",
  //     success: function(xmlContent) {
  //       // Utilizza il contenuto del file XML come desideri
  //       console.log(xmlContent);

  //       // Imposta il contenuto della console CodeMirror con i risultati del file XML
  //       consoleArea2.setValue(xmlContent);
  //     },
  //     error: function() {
  //       // Gestisci l'errore, ad esempio mostra un messaggio di errore
  //       console.log("Errore durante il recupero del file XML.");
  //     }
  //   });
  // });
  document.getElementById('loading-editor').style.display = 'block'; //A16 - AGGIUNTO
  $(document).ready(function() {
    if(localStorage.getItem("gameId") == "null") { //controllo game invece che turn
      document.getElementById('loading-editor').style.display = 'none'; //A16 - AGGIUNTO
      alert("Impossibile effettuare un nuovo tentativo: Hai già vinto!");
    } else {
      var risp; // variabile per salvare response
      var formData = new FormData();
      formData.append("testingClassName", "Test" + localStorage.getItem("classe") + ".java");
      formData.append("testingClassCode", editor.getValue());
      formData.append("underTestClassName", localStorage.getItem("classe")+".java");
      formData.append("underTestClassCode", sidebarEditor.getValue());
      //formData.append("IsWinner");                                                                                A16 non serve
      formData.append("turnId",localStorage.getItem("turnId"));
      formData.append("roundId",localStorage.getItem("roundId"));
      formData.append("gameId",localStorage.getItem("gameId"));
      formData.append("testClassId", localStorage.getItem("classe"));
      formData.append("difficulty", localStorage.getItem("difficulty"));
      formData.append("type", localStorage.getItem("robot")); // modificato
      formData.append("username", localStorage.getItem("username"));                                              //A16 aggiunta
      $.ajax({
        url: "http://localhost/api/run", // con questa verso il task 6, si salva e conclude la partita e si decreta il vincitore
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function(response) {
          console.log(response);
          

          risp = response;

          consoleArea.setValue(response.outCompile);
          highlightCodeCoverage($.parseXML(response.coverage));
          document.getElementById('loading-editor').style.display = 'none'; //A16 - AGGIUNTO
          /*consoleArea2.setValue(`Esito Risultati (percentuale di linee coperte)
          Il tuo punteggio: ${response.score.toString()}% LOC
          Il punteggio del robot: ${response.robotScore.toString()}% LOC`);*/
          
          if (localStorage.getItem("robot") == "Tutti i Robot") {
            if(response.win == "true") {
              var numberOfBeaten = Number(response.numberOfBeaten)
              var messaggio = "Eccellente: Hai battuto tutti i Robot! Hai totalizzato (" + response.score + "% LOC coverage) e hai vinto contro ";

              for(var i = 1; i <= numberOfBeaten; i++) {
                var chiaveBeaten = "beaten" + i;
                var datiRobotBattuto = response[chiaveBeaten];
                var dati = datiRobotBattuto.split("&");
                var index = dati[0];
                var coverage = dati[1];
                messaggio += "Robot " + index + "(" + coverage + "%)";
                if(i != numberOfBeaten) messaggio += ", ";
              }

              messaggio += ".";

              alert(messaggio);
            } 
            else if(response.numberOfBeaten == "0") {
              var numberOfUnbeaten = Number(response.numberOfUnbeaten);
              var messaggio = "Oh no! Non hai battuto nessun Robot! Hai totalizzato (" + response.score + "% LOC coverage) e devi battere ";

              for(var i = 1; i <= numberOfUnbeaten; i++) {
                var chiaveUnbeaten = "unbeaten" + i;
                var datiRobotNonBattuto = response[chiaveUnbeaten];
                var dati = datiRobotNonBattuto.split("&");
                var index = dati[0];
                var coverage = dati[1];
                messaggio += "Robot " + index + "(" + coverage + "%)";
                if(i != numberOfUnbeaten) messaggio += ", ";
              }

              messaggio += ".";
              
              alert(messaggio);
            } 
            else {
              var numberOfBeaten = Number(response.numberOfBeaten);
              var numberOfUnbeaten = Number(response.numberOfUnbeaten);
              var messaggio = "Bravo! Hai totalizzato (" + response.score + "% LOC coverage) e hai vinto contro  ";

              for(var i = 1; i <= numberOfBeaten; i++) {
                var chiaveBeaten = "beaten" + i;
                var datiRobotBattuto = response[chiaveBeaten];
                var dati = datiRobotBattuto.split("&");
                var index = dati[0];
                var coverage = dati[1];
                messaggio += "Robot " + index + "(" + coverage + "%)";
                if(i != numberOfBeaten) messaggio += ", ";
              }

              messaggio += ". Ti restano da battere ";

              for(var i = 1; i <= numberOfUnbeaten; i++) {
                var chiaveUnbeaten = "unbeaten" + i;
                var datiRobotNonBattuto = response[chiaveUnbeaten];
                var dati = datiRobotNonBattuto.split("&");
                var index = dati[0];
                var coverage = dati[1];
                messaggio += "Robot " + index + "(" + coverage + "%)";
                if(i != numberOfUnbeaten) messaggio += ", ";
              }
              messaggio += ".";
              alert(messaggio);
            }
          } 
          else {
            perc_robot = response.robotScore.toString();

            alert(response.win == "true" ? "Hai vinto!" : "Hai perso!");                      //A16 prima era true senza apici
          }                
          if(response.win == "true"){                                                         //A16 prima era true senza apici
            turno++;  // incremento il numero di turno giocati fino ad ora
            //localStorage.clear();
            localStorage.setItem("gameId",null); // setto gameId null invece che tutto
            //console.log(localStorage.getItem("gameId"));
          }
          else{
            //localStorage.setItem("gameId",(parseInt(localStorage.getItem("gameId"))+1).toString());
            //localStorage.setItem("roundId",(parseInt(localStorage.getItem("roundId"))+1).toString());
            //localStorage.setItem("turnId",(parseInt(localStorage.getItem("turnId"))+1).toString()); // vedere che fare
            //console.log(localStorage.getItem("turnId"));

            $.ajax({
              url:'http://localhost/api/save-data',
              data: {
                playerId: parseJwt(getCookie("jwt")).userId,
                classe: localStorage.getItem("classe"),
                robot: localStorage.getItem("robot"),
                difficulty: localStorage.getItem("difficulty"),
                username: localStorage.getItem("username")                  //A16 aggiunto username 
              },
              type:'POST',
              success: function (response) {
                // Gestisci la risposta del server qui
                localStorage.setItem("gameId", response.game_id);
                localStorage.setItem("turnId", response.turn_id);
                localStorage.setItem("roundId", response.round_id);
                console.log(localStorage.getItem("turnId"));
                turno++; // incremento il numero di turno giocati fino ad ora
                //window.location.href = "/editor";
              },
              dataType: "json",
              error: function (error) {
                console.error('Errore nell invio dei dati');
                alert("Dati non inviati con successo");
                // Gestisci l'errore qui
              }
            });

          }
        },
        error: function() {
          // Gestisci l'errore, ad esempio mostra un messaggio di errore
          console.log("Errore durante l'invio della partita.");
        }
      });
      
      //Da qui fino a FINE è stato aggiunto
      //aggiungere cose per copertura evosuite
      var classe = 'VolumeT8/FolderTreeEvo/' + localStorage.getItem("classe") + '/' + localStorage.getItem("classe") + 'SourceCode/' + localStorage.getItem("classe") + '.java';

      var test = '/VolumeT8/FolderTreeEvo/Tests/' + localStorage.getItem("turnId");

      // Definisci il percorso dell'API
      var apiBaseUrl = 'http://localhost:3080/api/';

      // Concatena il percorso della classe al percorso dell'API
      var url = apiBaseUrl + classe + '+' + test + '+/app';

      const javaCode = editor.getValue(); // codice della classe di test
      document.getElementById('loading-result').style.display = 'block'; //A16 -AGGIUNTA
      fetch(url, { 
            method: 'POST', 
            headers: { 'Content-Type': 'text/plain' },
            body: javaCode 
        }) // resa funzione una POST
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Errore nella richiesta HTTP: ' + response.status);
            console.log('Errore nella richiesta HTTP: ', response.status);
          }

          return response.blob();
        })
        .then(function (blob) {//aggiunta da noi
          var reader = new FileReader();

          reader.onload = function () {
            var csvContent = reader.result;

            console.log(csvContent);

            // Dividi il contenuto CSV in righe separate
            var lines = csvContent.split('\n');

            if (lines.length > 1) {
              // Dividi la seconda riga in elementi separati da virgole
              var secondRowElements = lines[1].split(',');
              var terzoRowElements = lines[2].split(',');
              var quartoRowElements = lines[3].split(',');
              var quintoRowElements = lines[4].split(',');
              var sestoRowElements = lines[5].split(',');
              var settimoRowElements = lines[6].split(',');
              var ottavoRowElements = lines[7].split(',');
              var nonoRowElements = lines[8].split(',');

              if (secondRowElements.length > 2) {
                // Estrai il terzo elemento (indice 2) della seconda riga
                var terzoElemento = parseInt(secondRowElements[2]*100);
                var terzoElemento1 = parseInt(terzoRowElements[2]*100);
                var terzoElemento2 = parseInt(quartoRowElements[2]*100);
                var terzoElemento3 = parseInt(quintoRowElements[2]*100);
                var terzoElemento4 = parseInt(sestoRowElements[2]*100);
                var terzoElemento5 = parseInt(settimoRowElements[2]*100);
                var terzoElemento6 = parseInt(ottavoRowElements[2]*100);
                var terzoElemento7 = parseInt(nonoRowElements[2]*100);

                document.getElementById('loading-result').style.display = 'none'; //A16 - AGGIUNTA
                console.log('Terzo elemento della seconda riga:', terzoElemento);
                consoleArea2.setValue(`Esito Risultati (percentuale di linee coperte)
Il tuo punteggio EvoSuite: ${terzoElemento}% LOC
Il tuo punteggio Jacoco: ${risp.score.toString()}% LOC
Informazioni aggiuntive di copertura:
Il tuo punteggio EvoSuite: ${terzoElemento1}% Branch
Il tuo punteggio EvoSuite: ${terzoElemento2}% Exception
Il tuo punteggio EvoSuite: ${terzoElemento3}% WeakMutation
Il tuo punteggio EvoSuite: ${terzoElemento4}% Output
Il tuo punteggio EvoSuite: ${terzoElemento5}% Method
Il tuo punteggio EvoSuite: ${terzoElemento6}% MethodNoException
Il tuo punteggio EvoSuite: ${terzoElemento7}% CBranch`);
//Il punteggio del robot: ${risp.robotScore.toString()}% LOC
              }
            }

          };

          reader.readAsText(blob);
        })
        .catch(function (error) {
          document.getElementById('loading-result').style.display = 'none';//A16 - AGGIUNTA
          console.log('Si è verificato un errore:', error);
        });

        //FINE

    }
  });
});

var fileName;

//risultati JACOCO da T7
var coverageButton = document.getElementById("coverageButton");
  coverageButton.addEventListener("click", processJaCoCoReport);
  function processJaCoCoReport() {
    // Effettua una richiesta al tuo controller Spring per ottenere il file di output di JaCoCo
    var formData = new FormData();
    formData.append("testingClassName", "Test" + localStorage.getItem("classe") + ".java");
    formData.append("testingClassCode", editor.getValue());
    formData.append("underTestClassName", localStorage.getItem("classe")+".java");
    formData.append("underTestClassCode", sidebarEditor.getValue());
    document.getElementById('loading-editor').style.display = 'block'; //A16 - AGGIUNTA

    $.ajax({
      url: "http://localhost/api/getJaCoCoReport",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      dataType: "xml", //potrebbe essere anche giusto leggere da un file xml di report di JaCoCo
      success: function(reportContent) {
        document.getElementById('loading-editor').style.display = 'none';//A16 - AGGIUNTA
        console.log(reportContent);
        // Una volta ricevuto il file di output di JaCoCo, elabora il contenuto
        highlightCodeCoverage(reportContent);
      },
      error: function() {
        document.getElementById('loading-editor').style.display = 'none';//A16 - AGGIUNTA
        alert("Si è verificato un errore. Assicurati prima che la compilazione vada a buon fine!");
        console.log("Errore durante il recupero del file di output di JaCoCo.");
      }
    });

    //aggiungere cose per copertura evosuite
    var classe = 'VolumeT8/FolderTreeEvo/' + localStorage.getItem("classe") + '/' + localStorage.getItem("classe") + 'SourceCode/' + localStorage.getItem("classe") + '.java'; //sidebarEditor.getValue(); // Assumendo che rappresenti la classe

    var test = '/VolumeT8/FolderTreeEvo/Tests/' + localStorage.getItem("turnId");

    // Definisci il percorso dell'API
    var apiBaseUrl = 'http://localhost:3080/api/';

    // Concatena il percorso della classe al percorso dell'API
    var url = apiBaseUrl + classe + '+' + test + '+/app';

    const javaCode = editor.getValue(); // codice della classe di test

    fetch(url, { 
          method: 'POST', 
          headers: { 'Content-Type': 'text/plain' },
          body: javaCode 
      }) // resa funzione una POST
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Errore nella richiesta HTTP: ' + response.status);
          console.log('Errore nella richiesta HTTP: ', response.status);
        }

        return response.blob();
      })
      .then(function (blob) {//aggiunta da noi
        var reader = new FileReader();

        reader.onload = function () {
          var csvContent = reader.result;

          console.log(csvContent);

          // Dividi il contenuto CSV in righe separate
          var lines = csvContent.split('\n');

          if (lines.length > 1) {
            // Dividi la seconda riga in elementi separati da virgole
            var secondRowElements = lines[1].split(',');
            var terzoRowElements = lines[2].split(',');
            var quartoRowElements = lines[3].split(',');
            var quintoRowElements = lines[4].split(',');
            var sestoRowElements = lines[5].split(',');
            var settimoRowElements = lines[6].split(',');
            var ottavoRowElements = lines[7].split(',');
            var nonoRowElements = lines[8].split(',');

            if (secondRowElements.length > 2) {
              // Estrai il terzo elemento (indice 2) della seconda riga
              var terzoElemento = parseInt(secondRowElements[2]*100);
              var terzoElemento1 = parseInt(terzoRowElements[2]*100);
              var terzoElemento2 = parseInt(quartoRowElements[2]*100);
              var terzoElemento3 = parseInt(quintoRowElements[2]*100);
              var terzoElemento4 = parseInt(sestoRowElements[2]*100);
              var terzoElemento5 = parseInt(settimoRowElements[2]*100);
              var terzoElemento6 = parseInt(ottavoRowElements[2]*100);
              var terzoElemento7 = parseInt(nonoRowElements[2]*100);

              console.log('Terzo elemento della seconda riga:', terzoElemento);
              consoleArea.setValue(`Esito Risultati (percentuale di linee coperte)
Il tuo punteggio: ${terzoElemento}% LOC
Informazioni aggiuntive di copertura:
Il tuo punteggio EvoSuite: ${terzoElemento1}% Branch
Il tuo punteggio EvoSuite: ${terzoElemento2}% Exception
Il tuo punteggio EvoSuite: ${terzoElemento3}% WeakMutation
Il tuo punteggio EvoSuite: ${terzoElemento4}% Output
Il tuo punteggio EvoSuite: ${terzoElemento5}% Method
Il tuo punteggio EvoSuite: ${terzoElemento6}% MethodNoException
Il tuo punteggio EvoSuite: ${terzoElemento7}% CBranch`);
            }
          }

        };

        reader.readAsText(blob);
      })
      .catch(function (error) {
        console.log('Si è verificato un errore:', error);
      });

  }
  
function openInfoModal() {
  var infoModal=document.getElementById("infoModal"); //A16 - HO COMMENTATO PERCHE' L'HO AGGIUNTO SOTTO
  infoModal.style.display="block";                    //A16 - HO COMMENTATO PERCHE' L'HO AGGIUNTO SOTTO

}
function closeInfoModal(){
  var infoModal=document.getElementById("infoModal");
  infoModal.style.display="none";
}
/*
// Aggiungi i campi e il titolo iniziali alla finestra modale
var modal2Content=document.querySelector("#infoModal .modal2-content");
// Aggiungi il titolo
var titleElement = document.createElement("h2");
titleElement.classList.add("modal2-title");
titleElement.textContent = "GAME INFO";
modal2Content.insertBefore(titleElement, modal2Content.firstChild);
// Aggiungi i campi
var idUtenteElement = document.createElement("p");
var usernamej = parseJwt(getCookie("jwt")).userId;
idUtenteElement.textContent = "UserID: "+usernamej;
modal2Content.appendChild(idUtenteElement);

var idPartitaElement = document.createElement("p");
var gameIDj = localStorage.getItem("gameId");
idPartitaElement.textContent = "GameID: "+gameIDj;
modal2Content.appendChild(idPartitaElement);

var idTurnoElement = document.createElement("p");
var turnoIDj = localStorage.getItem("roundId");
idTurnoElement.textContent = "Turno: " + turnoIDj;
modal2Content.appendChild(idTurnoElement);

var robotSceltoElement = document.createElement("p");
var robotj= localStorage.getItem("robot");
robotSceltoElement.textContent = "Robot:" +robotj;
modal2Content.appendChild(robotSceltoElement);
*/
// var difficoltaElement = document.createElement("p");
// difficoltaElement.textContent = "Livello: 1";
// modal2Content.appendChild(difficoltaElement);

  //codice custom per l'integrabilità con thymeleaf
  var robot = "[[${robot}]]";
  var username = "[[${username}]]";
  var gameIDJ = "[[${gameIDj}]]";