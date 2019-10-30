
	function injected_component_module () {

		var _app = null;
		var _exec = null;

		var _state = {

			visible: false,
			iframe_status: "not_ready",
			current_size: "3",

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

				_app.hub.add_observers( "injected_component_module", {

					iframe_component_ready: () => {

						_state.iframe_status = "ready";

					},

					root_size_change: ( data ) => {

						_state.root_width = data.width;
						_state.root_height = data.height;

						if ( _state.current_size === "3" ) {

							$( _state.overlay ).css( "height", data.height + "px" );
							$( _state.overlay ).css( "width", data.width + "px" );

						};

					},

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

				_state.iframe_component = _app.iframe_component_external_manager.create_iframe_component_instance( "iframe", "/pages/iframe/index.html" );
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

			toggle: () => {

				if ( _state.visible ) {

					_pub.hide_component();

				} else {

					_pub.show_component();

				};

			},

			get_iframe_status: () => {

				return _state.iframe_status;

			},

			send_message: ( name, data ) => {

				_state.iframe_component.send_message( name, data );

			},

			set_size_1: function () {

				$( _state.overlay ).css( "width", "" );
				$( _state.overlay ).css( "height", "" );

				_state.current_size = "1";
				_state.overlay.removeClass( "size_1 size_2 size_3" ).addClass( "size_1" );

			},

			set_size_2: function () {

				$( _state.overlay ).css( "width", "" );
				$( _state.overlay ).css( "height", "" );

				_state.current_size = "2";
				_state.overlay.removeClass( "size_1 size_2 size_3" ).addClass( "size_2" );

			},

			set_size_3: function () {

				$( _state.overlay ).css( "height", _state.root_height + "px" );
				$( _state.overlay ).css( "width", _state.root_width + "px" );

				_state.current_size = "3";
				_state.overlay.removeClass( "size1 size_2 size_3" ).addClass( "size_3" );

			},

		};

		return _pub;

	};