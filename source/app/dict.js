function Translation(arr)
{
	var prop=["settings","general","extra","products","start","useInfo","noTable","noTableLabel","password","passwordLabel","nameLabel","priceLabel","cancel","modify","noPassword","tables","waitForData","earned","orderTot","orderPending","stop","stopInfo","conLost","reCon","tryCon","loading","tableName","continue","users","logs","close","cook","waiter","helpUser","helpLog","order","nopending","neworders","MarkasFree","AddOrder","Order","Extras","AddtoOrders","Authentication","Username","Password","Authenticate","Accessibility","ToggleLeftHandedMode","NoTable","NoOrders","Settings","Cancel"];

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
	this.tableName="Table";
	this.continue="Next";
	this.users="Users";
	this.logs="Logs";
	this.close="Close";
	this.cook="Cook";
	this.waiter="Waiter";
	this.helpUser="Press on the <i class=\"icon add\"></i> icon, to add a user.<br><div class=\"desc\"><h4>Roles</h4><strong>Waiter:</strong> Can access the mobile app.<br><strong>Cook:</strong> Can access to the overview.</div>";
	this.helpLog="You can check what happened at any time using this window";
	this.order="Order";
	this.nopending="There are no orders available";
	this.neworders="New orders";
  this.MarkasFree = "Mark as Free";
  this.AddOrder = "Add Order";
  this.Order = "Order";
  this.Extras = "Extras";
  this.AddtoOrders = "Add to Orders";
  this.Authentication = "Authentication";
  this.Username = "Username";
  this.Password = "Password";
  this.Authenticate = "Authenticate";
  this.Accessibility = "Accessibility";
  this.ToggleLeftHandedMode = "Toggle Left-Handed Mode";
  
  this.NoTable = "No Table";
  this.NoOrders = "No Orders";
  this.Settings = "Settings";
  this.Cancel = "Cancel";
  
	if(!!arr)
	{
		for(var i = arr.length; --i>=0;){
			this[prop[i]]=arr[i];
		}
	}
}

Translation.applyTo=function(root)
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
	it:["Impostazioni","Generali","Extra","Prodotti","Avvia","Seleziona un menu per visualizzare le impostazioni.","Numero tavoli","Numero","Password","Parola segreta","Nome","Prezzo","Annulla","Modifica","Nessuna password","Tavoli","In attesa di dati","Guadagno","Ordini totali","Ordini attivi","Ferma","Se fermi l'esecuzione, alcuni dati potrebbero andare persi","Connessione persa","Connessione ristabilita","La connessione è stata persa, tutto riprenderà appena possibile.","Caricamento","Tavolo","Avanti","Utenti","Cronologia","Chiudi","Cuoco","Cameriere","Premi sul tasto <i class=\"icon add\"></i> per aggiungere un'utente.<br><div class=\"desc\"><h4>Ruoli</h4><strong>Cameriere:</strong> Può accedere all'applicazione.<br><strong>Cuoco:</strong> Può accedere alla overview.</div>","Puoi controlalre qui, cosa è successo in qualsiasi momento della esecuzione.","Ordine","Non ci sono ordini su questo tavolo","Nuovi ordini","Segna come libero","Aggiungi ordine","Ordine","Extra","Aggiungere agli ordini","Autenticazione","Utente","Password","Autentica","Accessbilità","Alterna modalità mancino","Nessun Tavolo","Nessun Ordine","Impostationi","Annulla"],
	de:["Einstellungen","Allgemein","Extra","Produkte","Starten","Wählen sie ein Menu um die Einstellungen zu verändern.","Anzahl der Tische","Nummer","Password","Geheimwort","Name","Preis","Abbrechen","Speichern","Kein Password","Tische","Warte auf Daten","Gewinn","Anz. Bestellungen","Aktive Bestellungen","Stoppen","Wenn sie das Programm stoppen, können Daten verloren gehen","Verbindung verloren","Verbunden","Verbindung verloren, es wird nach einer neue Verbindung gesucht.","Beim Laden","Tisch","Weiter","Benutzer","Verlauf","Schließen","Koch","Kellner","Drücken Sie auf das <i class=\"icon add\"></i> Icon, um ein Benutzer hinzuzufügen.<br><div class=\"desc\"><h4>Rollen</h4><strong>Kellner:</strong> Kann aufs app zugreifen.<br><strong>Koch:</strong> Kann auf der Overview zugreifen.</div>","Sie können hier immer kontrollieren was passiert ist.","Bestellung","Es sind keine Bestellungen auf diesem Tisch.","Neue bestellungen","Als frei markieren","Bestellung hinzufügen","Bestellung","Extras","Zu Bestellungen hinzufügen","Authentifizierung","Benutzername","Passwort","Authentisieren","Bedienungshilfen","Linkshänder-Modus umschalten","Kein Tisch","Keine Bestellungen","Einstellungen","Abbrechen"]
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

function l(key){
	return activeLanguage[key];
}