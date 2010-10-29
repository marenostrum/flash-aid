var flashaidOptions = {

    openFile : function(aText) {//select terminal emulator executable and add path to preference

	//access preferences interface
	this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			  .getService(Components.interfaces.nsIPrefService)
			  .getBranch("extensions.flashaid.");

	//open file picker
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"]
		.createInstance(nsIFilePicker);
	fp.init(window, aText, nsIFilePicker.modeOpen);
	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK) {
	    var file = fp.file;
	    //add path to terminal preference
	    this.prefs.setCharPref("terminal", file.path);
	}
    }//end of function
};