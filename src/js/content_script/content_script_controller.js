
	function content_script_controller () {

		var _app = null;
		var _exec = null;

		var _state = {

		};

		var _priv = {

			// converters


			// procedures

				show_sidebar: function ( exec ) {

					exec( "injected_component_module", "show_component" );

				},

				hide_sidebar: function ( exec ) {

					exec( "injected_component_module", "hide_component" );

				},

				kickstart: async () => {

					_exec( "injected_component_module", "inject_component" );

				},

				init_email_detector: () => {

					_app.x.detect({

						method: "normal",
						selector: ".slds-form-element",
						callback: async ( element ) => {

							_exec( "priv", "handle_email_element", element );

						},

					});

				},

			// handlers

				handle_runtime_message: async ( message, sender, callback, exec ) => {

					exec( "log", "write_exec", "message", message );

					if ( message.name === "ping" ) {

						callback( true );

					} if ( message.name === "show_nutrition_info" ) {

						exec( "injected_component_module", "toggle" );
						exec( "injected_component_module", "send_message", "show_nutrition_info", { nutrition_info: message.data.nutrition_info } );

					};

				},

			// observers

				add_observers: () => {

					_app.hub.add_observers( "content_script_controller", {

						close_button_click: () => {

							_exec( "priv", "hide_sidebar" );

						},

						iframe_component_ready: () => {

							_exec( "priv", "handle_iframe_component_ready" );

						},

					});

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

				_exec( "priv", "kickstart" );

				_priv.add_observers();

			},

		};

		return _pub;

	};
