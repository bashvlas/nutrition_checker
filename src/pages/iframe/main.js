
	new Vue({

		el: "#root",

		data: {

			active_page_name: "not_found",
			nutrition_info: null,

		},

		methods: {

			close_button_click: function () {

				window.parent.postMessage({

					name: "close_button_click",

				}, "*" );

			},

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

				if ( item_name === "iframe_tester" ) {

					chrome.tabs.create({

						active: true,
						url: chrome.extension.getURL( "/pages/iframe_tester/index.html" ),

					});

				};

				this.close_drawer();

			},

		},

		mounted: async function () {

			const resizeObserver = new ResizeObserver( entries => {

				window.parent.postMessage({

					name: "root_size_change",
					data: {

						width: entries[ 0 ].contentRect.width,
						height: entries[ 0 ].contentRect.height,

					},

				}, "*" );

			});

			resizeObserver.observe( document.querySelector( '#root' ) );

			window.addEventListener( "message", ( event ) => {

				var name = event.data.name;
				var data = event.data.data;

				if ( name === "show_nutrition_info" ) {

					console.log( "show_nutrition_info", data.nutrition_info );

					if ( data.nutrition_info ) {

						this.nutrition_info = data.nutrition_info;
						this.active_page_name = "nutrition_info"

					} else {

						this.active_page_name = "not_found";

					};

				} else if ( name === "set_active_page_name" ) {

					this.active_page_name = data.active_page_name;

				};

			});

		},

	});
