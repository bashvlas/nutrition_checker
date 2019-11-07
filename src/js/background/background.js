
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

				background_controller: window.background_controller(),

			};

		// init modules

			app.log.init( app );
			app.hub.init( app );
			app.exec.init( app );

			app.chrome.init( app );
			app.bg_api.init( app );

			app.background_controller.init( app );

		// register exec modules

			app.exec.add_module( "*", "log", app.log );
			app.exec.add_module( "*", "chrome", app.chrome );

		// register bg_api

			app.bg_api.register( "background_controller", app.background_controller );

	} ( window[ window.webextension_library_name ] ) )
