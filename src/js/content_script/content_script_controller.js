
	function content_script_controller () {

		var _app = null;
		var _exec = null;

		var _state = {

		};

		var _priv = {

			// handlers

				handle_runtime_message: async ( message, sender, callback, exec ) => {

					exec( "log", "write_exec", "message", message );

					if ( message.name === "ping" ) {

						callback( true );

					} if ( message.name === "show_nutrition_info" ) {

						exec( "injected_component_module", "show_component" );
						exec( "injected_component_module", "send_message", "show_nutrition_info", { nutrition_info: message.data.nutrition_info } );

					};

				},

			// observers

				add_observers: () => {

					chrome.runtime.onMessage.addListener( ( message, sender, callback ) => {

						_exec( "priv", "handle_runtime_message", message, sender, callback );

					});

				},

		};

		var _pub = {

			init: ( app ) => {

				_app = app;

				_exec = _app.exec.get_exec( "content_script_controller" );

				_app.exec.add_module( "content_script_controller", "priv", _priv );

				_exec( "injected_component_module", "inject_component" );

				_priv.add_observers();

			},

		};

		return _pub;

	};
