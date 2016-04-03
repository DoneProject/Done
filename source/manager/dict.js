function Translation(arr)
{
  var prop=["settings","general","extra","products","start","useInfo","noTable","noTableLabel","password","passwordLabel","nameLabel","priceLabel","cancel","modify","noPassword","tables","waitForData","earned","orderTot","orderPending","stop","stopInfo","conLost","reCon","tryCon","loading"];
  this.langKey="en";
  this.settings="Settings";
  this.general="General";
  this.extra="Extra";
  this.products="Products";
  this.start="Start";
  this.useInfo="Select a tab o change the settings";
  this.noTable="Number of tables";
  this.noTableLabel="Number"
  this.password="Password";
  this.passwordLabel="Secret word";
  this.nameLabel="Name";
  this.priceLabel="Price";
  this.cancel="Cancel";
  this.modify="Modify";
  this.noPassword="No password set";
  this.tables="Tables";
  this.waitForData="Waiting for Data";
  this.earned="Earned";
  this.orderTot="Total orders";
  this.orderPending="Active orders";
  this.stop="Stop";
  this.stopInfo="If you stop the execution, some data may be lost.";
  this.conLost="Connection lost";
  this.reCon="Reconnected";
  this.tryCon="The connection was lost, service will resume ASAP.";
  this.loading="loading";
  
  if(!!arr)
  {
    for(var i = arr.length; --i>=0;){
      this[prop[i]]=arr[i];
    }
  }
}

Translation.prototype.applyTo=function(root)
{
  root = root || document;
  var tl = root.querySelectorAll("[data-translabel]");
  var ts = root.querySelectorAll("[data-translation]");
  var t = null ,key = null;
  for(var i = tl.length; --i>=0;)
  {
    t = tl[i];
    key = t.getAttribute("data-translabel");
    t.setAttribute("placeholder",activeLanguage[key]);
  }
  for(var i = ts.length; --i>=0;)
  {
    t = ts[i];
    key = t.getAttribute("data-translation");
    t.innerHTML=activeLanguage[key];
  }
}

activeLanguage = null;

var lang_arr = {
  it:["Impostazioni","Generali","Extra","Prodotti","Avvia","Seleziona un menu per visualizzare le impostazioni.","Numero tavoli","Numero","Password","Parola segreta","Nome","Prezzo","Cancella","Modifica","Nessuna password","Tavoli","In attesa di dati","Guadagno","Ordini totali","Ordini attivi","Ferma","Se fermi l'esecuzione, alcuni dati potrebbero andare persi","Connessione persa","Connessione ristabilita","La connessione è stata persa, tutto riprenderà appena possibile.","Caricamento"],
  de:["Einstellungen","Allgemein","Extra","Produkte","Starten","Wählen sie ein Menu um die Einstellungen zu verändern.","Anzahl der Tische","Nummer","Password","Geheimwort","Name","Preis","Abbrechen","Speichern","Kein Password","Tische","Warte auf Daten","Verdienst","Anz. Bestellungen","Aktive Bestellungen","Stoppen","Wenn sie das Programm stoppen, können Daten verloren gehen","Verbindung verloren","Verbunden","Verbindung verloren, es wird nach einer neue Verbindung gesucht.","Beim Laden"]
};
 
if("language" in navigator)
{
  try{
  var lan = navigator.language.split(/(\-|_)/)[0].toLocaleLowerCase() && "de";
    activeLanguage=new Translation(lang_arr[lan]);
    activeLanguage.langKey=lan;
    delete lang_arr;
  }catch(e){
    activeLanguage=new Translation();
  }
}
console.log(activeLanguage);