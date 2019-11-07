
	function injected_component_module () {

		var _app = null;
		var _exec = null;

		var _state = {

			visible: false,

		};

		var _data = {

		};

		var _priv = {

			inject_style: function ( src ) {

				var link = document.createElement( 'link' );
				link.href = chrome.extension.getURL( src );
				link.rel = "stylesheet";

				document.head.appendChild( link );

			},

			add_observers: () => {

				window.addEventListener( "message", ( event ) => {

					var name = event.data.name;
					var data = event.data.data;

					console.log( "window_message", name, data );

					if ( name === "root_size_change" ) {

						$( _state.overlay ).css({

							width: data.width,
							height: data.height,

						});

					} else if ( name === "close_button_click" ) {

						_pub.hide_component();

					};

				});

			},

		};

		var _pub = {

			init: ( app ) => {

				_app = app;
				_exec = _app.exec.get_exec( "*" );

				_priv.add_observers();

			},

			inject_component: () => {

				_priv.inject_style( "/assets/content.css" );

				_state.overlay = $(
					`
						<div id = "webx_overlay" class = "size_3" >
							<div id = "webx_iframe_container" ></div>
						</div>
					`
				);

				_state.iframe_component = _app.iframe_component_external_manager.create_iframe_component_instance( "nutrition_checker_iframe", "/pages/iframe/index.html" );
				_state.overlay.find( "#webx_iframe_container" ).append( _state.iframe_component.element );

				$( document.documentElement ).append( _state.overlay );

			},

			hide_component: () => {

				_state.visible = false;
				$( _state.overlay ).css({ "display": "none" });
				_exec( "bg_api", "exec", "tab_storage_manager", "set_property", [ "sidebar_active", false ] );

			},

			show_component: () => {

				_state.visible = true;
				$( _state.overlay ).css({ "display": "flex" });
				_exec( "bg_api", "exec", "tab_storage_manager", "set_property", [ "sidebar_active", true ] );

			},

			send_message: ( name, data ) => {

				document.querySelector( "iframe[name='nutrition_checker_iframe']" ).contentWindow.postMessage({ name, data }, "*" );

			},

		};

		return _pub;

	};