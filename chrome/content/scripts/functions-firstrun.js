var flashaidFirstrun = {

    init: function(){//get current version from extension manager

	try {// Firefox <= 3.6

	    //get current version from extension manager
	    var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
		.getService(Components.interfaces.nsIExtensionManager);
	    var current = gExtensionManager.getItemForID("flashaid@lovinglinux.megabyet.net").version;

	    flashaidFirstrun.updateInstall(current);
	}
	catch(e){// Firefox >=4.0

	    //get current version from extension manager
	    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    
	    AddonManager.getAddonByID("flashaid@lovinglinux.megabyet.net", function(addon) {

		var current = addon.version;
		flashaidFirstrun.updateInstall(current);
	    });
	}
	window.removeEventListener("load",function(){ flashaidFirstrun.init(); },true);
    },

    updateInstall: function(aVersion){//check version and perform updates

	//access preferences interface
	this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
	    .getService(Components.interfaces.nsIPrefService)
	    .getBranch("extensions.flashaid.");

	//firstrun, update and current declarations
	var ver = -1, firstrun = true;
	var current = aVersion;

	try{//check for existing preferences
	    ver = this.prefs.getCharPref("version");
	    firstrun = this.prefs.getBoolPref("firstrun");
	}catch(e){
	    //nothing
	}finally{

	    if(firstrun){//actions specific for first installation

		var navbar = document.getElementById("nav-bar");
		var newset = navbar.currentSet + ",flashaidbutton-1";
		navbar.currentSet = newset;
		navbar.setAttribute("currentset", newset );
		document.persist("nav-bar", "currentset");

		//set preferences
		this.prefs.setBoolPref("firstrun",false);
		this.prefs.setCharPref("version",current);

		//automatic installer
		var installer = setTimeout("flashaidInstall.flashaidInstaller('install')",3000);
	    }

	    if(ver !== current && !firstrun){//actions specific for extension updates

		//set preferences
		this.prefs.setCharPref("version",current);
		
		//var testversion = ver.replace(/rc/,"");

		//if (testversion !== "1.0.13" && testversion !== "1.0.12"){
		    //get os architecture
		    var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			    .getService(Components.interfaces.nsIHttpProtocolHandler).oscpu; 
			    
		    if(osString.match(/x86_64/)){//match 64bit system
			//automatic installer
			var installer = setTimeout("flashaidInstall.flashaidInstaller('install')",3000);
		    }
		//}
	    }
	}
    }
};
//event listeners to call the functions when Firefox starts
window.addEventListener("load",function(){ flashaidFirstrun.init(); },true);
