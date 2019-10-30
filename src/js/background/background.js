
	( async function ( x ) {

		// create app

			var resources = await x.util.load_resources([

				[ "config", "json", "local/config.json" ],

			])

			var app = {

				name: "background",

				x: x,
				config: resources.config,

				log: x.modules.log(),
				hub: x.modules.hub(),
				exec: x.modules.exec(),

				chrome: x.modules.chrome(),
				bg_api: x.modules.bg_api(),

				api_manager: window.api_manager(),
				tab_storage_manager: window.tab_storage_manager(),
				background_controller: window.background_controller(),

			};

		// init modules

			app.log.init( app );
			app.hub.init( app );
			app.exec.init( app );

			app.chrome.init( app );
			app.bg_api.init( app );

			app.api_manager.init( app );
			app.tab_storage_manager.init( app );
			app.background_controller.init( app );

		// register exec modules

			app.exec.add_module( "*", "log", app.log );
			app.exec.add_module( "*", "chrome", app.chrome );
			app.exec.add_module( "*", "api_manager", app.api_manager );

		// register bg_api

			app.bg_api.register( "background_controller", app.background_controller );
			app.bg_api.register( "tab_storage_manager", app.tab_storage_manager );

	} ( window[ window.webextension_library_name ] ) )
