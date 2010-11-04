var flashaidInstall = {

    flashaidInstaller: function(aAction){//run flash remover/installer

	//access preferences interface
	this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("extensions.flashaid.");

	//declare temp folder
	var tempfolder = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("ProfD", Components.interfaces.nsIFile);
	tempfolder.append("extensions");
	tempfolder.append("flashaid@lovinglinux.megabyet.net");
	tempfolder.append("chrome");
	tempfolder.append("content");
	tempfolder.append("tmp");
	//create tempfolder if not exists
	if( !tempfolder.exists() || !tempfolder.isDirectory() ) {
	    tempfolder.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
	}

	//declare, remove and create temporary script
	var tempscript = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("ProfD", Components.interfaces.nsIFile);
	tempscript.append("extensions");
	tempscript.append("flashaid@lovinglinux.megabyet.net");
	tempscript.append("chrome");
	tempscript.append("content");
	tempscript.append("tmp");
	tempscript.append("flashaid.sh");
	if(tempscript.exists()) {
	    tempscript.remove(false);
	}
	tempscript.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);

	//declare terminal path
	var terminal_path = "/usr/bin/x-terminal-emulator";
	//initialize terminal with path
	var terminal = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);
	terminal.initWithPath(terminal_path);

	//get os architecture
	var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
		.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu; 

	if(terminal.exists() && tempscript.exists()){//match if necessary files exists and run the installer/remover

	    //declare basic shell script lines
	    var bashline = "#!/bin/bash";
	    var newline = "\n";
	    //declare flash removal commands
	    var rlight = "sudo apt-get --yes purge lightspark";
	    var rswfdec = "sudo apt-get --yes purge swfdec-mozilla";
	    var rgnash = "sudo apt-get --yes purge mozilla-plugin-gnash";
	    var rgnash2 = "sudo apt-get --yes purge browser-plugin-gnash";
	    var radobe = "sudo apt-get --yes purge adobe-flashplugin";
	    var rdefault = "sudo apt-get --yes purge flashplugin-nonfree";
	    var rinstaller = "sudo apt-get --yes purge flashplugin-installer";
	    var rlocal = "rm -f /home/**/.mozilla/plugins/*flash*so";
	    var rwine = "rm -rf /home/**/.wine/dosdevices/c:/windows/system32/Macromed/Flash";
	    var rfaddons = "sudo rm -f /usr/lib/firefox-addons/plugins/libflashplayer.so";
	    var rmozilla = "sudo rm -f /usr/lib/mozilla/plugins/libflashplayer.so";
	    var update = "sudo apt-get update";

	    //fetch message from strbundle
	    var strbundle = document.getElementById("flashaidstrings");
	    //declare basic terminal command lines
	    var pleasewaitmessage = strbundle.getString("pleasewait");
	    var pleasewait = "echo \""+pleasewaitmessage+"\"";
	    var endlinemessage = strbundle.getString("done");
	    var endline = "echo -n \""+endlinemessage+"\" && read";

	    //declare the script should not run (necessary if the user cancels the installation)
	    var runscript = false;
	    var flversion = "32bit";

	    if(aAction == "install"){

		if(osString.match(/x86_64/)){//match 64bit system

		    //prompt user for confirmation and version selection
		    var strbundle = document.getElementById("flashaidstrings");
		    var params = {inn:{flversion:"64bit"}, out:null};
		    window.openDialog("chrome://flashaid/content/selectversion64.xul", "",
			"chrome, dialog, modal, resizable=yes", params).focus();

		    if (params.out) {

			//get options from params.out
			var flversion = params.out.flversion;
			var runscript = true;
		    }
		}
		else {

		    //prompt user for confirmation and version selection
		    var strbundle = document.getElementById("flashaidstrings");
		    var params = {inn:{flversion:"32bit"}, out:null};
		    window.openDialog("chrome://flashaid/content/selectversion32.xul", "",
			"chrome, dialog, modal, resizable=yes", params).focus();

		    if (params.out) {

			//get options from params.out
			var flversion = params.out.flversion;
			var runscript = true;
		    }
		}
	    }

	    if(aAction == "remove"){
		var runscript = true;
	    }

	    if(flversion == "32bit"){//match 32bit architecture and declare command

		var commandline = "sudo apt-get --yes install flashplugin-nonfree && sudo ln -s /usr/lib/mozilla/plugins/flashplugin-alternative.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
	    }

	    if(flversion == "64bit"){//match 64bit architecture and declare command

		var commandline = "cd \""+tempfolder.path+"\" && rm -f *.tar.gz* && wget http://download.macromedia.com/pub/labs/flashplayer10/flashplayer_square_p2_64bit_linux_092710.tar.gz && tar xvf flashplayer_square_p2_64bit_linux_092710.tar.gz && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *.tar.gz*";
	    }

	    if(runscript == true){

		//write command lines to temporary script
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
			.createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(tempscript, 0x02 | 0x10 , 0777, 0);

		var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
			.createInstance(Components.interfaces.nsIConverterOutputStream);
		converter.init(foStream, "UTF-8", 0, 0);
		converter.writeString(bashline);
		converter.writeString(newline);
		converter.writeString(newline);
		converter.writeString(pleasewait);
		converter.writeString(newline);
		converter.writeString(rlight);
		converter.writeString(newline);
		converter.writeString(rswfdec);
		converter.writeString(newline);
		converter.writeString(rgnash);
		converter.writeString(newline);
		converter.writeString(rgnash2);
		converter.writeString(newline);
		converter.writeString(radobe);
		converter.writeString(newline);
		converter.writeString(rdefault);
		converter.writeString(newline);
		converter.writeString(rinstaller);
		converter.writeString(newline);
		converter.writeString(rlocal);
		converter.writeString(newline);
		converter.writeString(rfaddons);
		converter.writeString(newline);
		converter.writeString(rmozilla);
		converter.writeString(newline);
		converter.writeString(rwine);
		if(aAction == "install"){
		    converter.writeString(newline);
		    converter.writeString(update);
		    converter.writeString(newline);
		    converter.writeString(commandline);
		}
		converter.writeString(newline);
		converter.writeString(endline);
		converter.close(); 

		//read all data from tempscript
		var scriptcontent = "";
		var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"]
			.createInstance(Components.interfaces.nsIFileInputStream);
		var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"]
			.createInstance(Components.interfaces.nsIConverterInputStream);
		fstream.init(tempscript, -1, 0, 0);
		cstream.init(fstream, "UTF-8", 0, 0);

		let (str = {}) {
		    cstream.readString(-1, str); // read the whole file and put it in str.value
		    scriptcontent = str.value;
		}
		cstream.close();

		//prompt user for confirmation and version selection
		var strbundle = document.getElementById("flashaidstrings");
		var params = {inn:{commands:scriptcontent}, out:null};
		window.openDialog("chrome://flashaid/content/confirminstall.xul", "",
		    "chrome, dialog, modal, resizable=yes", params).focus();

		if (params.out) {

		    //get options from params.out
		    var scriptcontent = params.out.commands;

		    //execute the script
		    var process = Components.classes['@mozilla.org/process/util;1']
			    .createInstance(Components.interfaces.nsIProcess);
		    process.init(terminal);
		    var arguments = ["-e","'"+tempscript.path+"'"];
		    process.run(false, arguments, arguments.length);
		}
	    }
	}
    },

    cleanUpTempFiles: function () {//delete temporary files when Firefox closes

	//delete temporary script
	var tempscript = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("ProfD", Components.interfaces.nsIFile);
	tempscript.append("extensions");
	tempscript.append("flashaid@lovinglinux.megabyet.net");
	tempscript.append("chrome");
	tempscript.append("content");
	tempscript.append("tmp");
	tempscript.append("flashaid.sh");
	if(tempscript.exists()) {
	    tempscript.remove(false);
	}
	//alert("flashaidInstall.cleanUpTempFiles");

    }//end of function
};
//event listeners to call the functions when Firefox starts and closes
window.addEventListener("unload", function(e) { flashaidInstall.cleanUpTempFiles(); }, false);