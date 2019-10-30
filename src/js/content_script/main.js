
	( async function ( x ) {

		window.extension_is_running = true;

		var resources = await x.util.load_resources([

			[ "config", "json", "local/config.json" ],

		]);

		var app = {

			name: "content",

			x: x,
			config: resources.config,

			log: x.modules.log(),
			hub: x.modules.hub(),
			exec: x.modules.exec(),

			chrome: x.modules.chrome(),
			bg_api: x.modules.bg_api(),
			iframe_component_external_manager: x.modules.iframe_component_external_manager(),

			injected_component_module: window.injected_component_module(),
			content_script_controller: window.content_script_controller(),

		};

		app.log.init( app );
		app.hub.init( app );
		app.exec.init( app );

		app.chrome.init( app );
		app.bg_api.init( app );
		app.iframe_component_external_manager.init( app );

		// add exec modules

			app.exec.add_module( "*", "log", app.log );
			app.exec.add_module( "*", "chrome", app.chrome );
			app.exec.add_module( "*", "bg_api", app.bg_api );
			app.exec.add_module( "*", "injected_component_module", app.injected_component_module );
			app.exec.add_module( "*", "content_script_controller", app.content_script_controller );

		// init controller

			app.injected_component_module.init( app );
			app.content_script_controller.init( app );

			console.log( "nutrition_checker" );

	} ( window[ window.webextension_library_name ] ) );