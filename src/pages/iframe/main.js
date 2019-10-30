
	window.main_vm = new Vue({

		el: "#root",
		data: {

			active_page_name: "not_found",
			nutrition_info: null,

		},

		methods: {

			init: async function ( app ) {

				this.app = app;
				this.exec = app.exec.get_exec( "*" );

				const resizeObserver = new ResizeObserver( entries => {

					this.app.iframe_component_internal_manager.send_message( "root_size_change", {

						active_page_name: window.main_vm.active_page_name,

						width: entries[ 0 ].contentRect.width,
						height: entries[ 0 ].contentRect.height,

					});

				});

				resizeObserver.observe( document.querySelector( '#root' ) );

				this.app.hub.add_observers( "iframe", {

					show_nutrition_info: ( data ) => {

						console.log( "show_nutrition_info", data.nutrition_info );

						if ( data.nutrition_info ) {

							this.nutrition_info = data.nutrition_info;
							this.active_page_name = "nutrition_info"

						} else {

							this.active_page_name = "not_found";

						};

					},

					set_active_page_name: ( data ) => {

						this.active_page_name = data.active_page_name;

					},

				});

			},

			close_button_click: function () {

				this.app.iframe_component_internal_manager.send_message( "close_button_click" );

			},

			// drawer

				close_drawer: function () {

					$( "#drawer_overlay" ).get( 0 ).classList.remove( "opened" );

					setTimeout( () => {

						$( "#drawer_overlay" ).css( "display", "none" );

					}, 200 );

				},

				nav_button_click: async () => {

					$( "#drawer_overlay" ).css( "display", "block" );

					setTimeout( () => {

						$( "#drawer_overlay" ).get( 0 ).classList.add( "opened" );

					}, 1 );

				},

				drawer_overlay_click: function () {

					this.close_drawer();

				},

				drawer_click: ( event ) => {

					event.stopPropagation();

				},

				drawer_item_click: async function ( item_name ) {

					if ( item_name === "log_out" ) {

					};

					this.close_drawer();

				},

		},

		watch: {

			auto_open: function () {

				this.exec( "chrome", "call", "storage.local.set", { auto_open: this.auto_open } );

			},

		},

	});

	( function ( x ) {

		x.util.load_resources([

			[ "config", "json", "local/config.json" ],

		]).then( ( resources ) => {

			// create the app object which contains useful references for each module

				var config = resources[ "config" ];

				var app = {

					name: "iframe",

					x: x,
					config: config,
					resources: resources,

					log: x.modules.log(),
					hub: x.modules.hub(),
					exec: x.modules.exec(),

					chrome: x.modules.chrome(),
					bg_api: x.modules.bg_api(),
					iframe_component_internal_manager: x.modules.iframe_component_internal_manager(),

				};

			// initialize needed modules

				app.log.init( app );
				app.hub.init( app );
				app.exec.init( app );

				app.chrome.init( app );
				app.bg_api.init( app );
				app.iframe_component_internal_manager.init( app );

			// register exec

				app.exec.add_module( "*", "chrome", app.chrome );
				app.exec.add_module( "*", "bg_api", app.bg_api );

			// fire an event after all modules 

				window.main_vm.init( app );
				app.iframe_component_internal_manager.send_message( "iframe_component_ready" );

		});

	} ( window.webextension_library ) );
