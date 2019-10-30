
	window.data = {

		nutrition_info_arr: [

			{

				name: "apple",
				calories: 41,
				info_item_arr: [

					{
						name: "Total Fat",
						amount: "0.2 g",
						daily_value: 0,

						child_info_item_arr: [

							{
								name: "Saturated fat",
								amount: "20 g",
								daily_value: 0
							},
							{
								name: "Polyunsaturated fat",
								amount: "20.1 g",
								daily_value: null,
							},
							{
								name: "Monounsaturated fat",
								amount: "50 g",
								daily_value: 0,
							}

						]

					},

					{
						name: "Cholesterol",
						amount: "30 mg",
						daily_value: 0,
					},

					{
						name: "Sodium",
						amount: "12 mg",
						daily_value: 0,
					},

					{
						name: "Potassium",
						amount: "107 mg",
						daily_value: 3,
					},

					{
						name: "Total Carbohydrate",
						amount: "14 g",
						daily_value: 4,

						child_info_item_arr: [

							{
								name: "Dietary fiber",
								amount: "2.4 g",
								daily_value: 9
							},
							{
								name: "Sugar",
								amount: "910 g",
								daily_value: null,
							}

						]

					},

				],
				vitamin_data_arr: [

					{ name: "Vitamin A", 		daily_value: 1, },
					{ name: "Vitamin C", 		daily_value: 7, },
					{ name: "Calcium", 			daily_value: 40, },
					{ name: "Iron", 			daily_value: 50, },
					{ name: "Vitamin D", 		daily_value: 22, },
					{ name: "Vitamin B-6", 		daily_value: 11, },
					{ name: "Cobalamin", 		daily_value: 0, },
					{ name: "Magnesium", 		daily_value: 1, },

				],

			},

			{

				name: "carrot",
				calories: 52,
				info_item_arr: [

					{
						name: "Total Fat",
						amount: "0.2 g",
						daily_value: 0,

						child_info_item_arr: [

							{
								name: "Saturated fat",
								amount: "0 g",
								daily_value: 0
							},
							{
								name: "Polyunsaturated fat",
								amount: "0.1 g",
								daily_value: null,
							},
							{
								name: "Monounsaturated fat",
								amount: "0 g",
								daily_value: 0,
							}

						]

					},

					{
						name: "Cholesterol",
						amount: "0 mg",
						daily_value: 0,
					},

					{
						name: "Sodium",
						amount: "1 mg",
						daily_value: 0,
					},

					{
						name: "Potassium",
						amount: "107 mg",
						daily_value: 3,
					},

					{
						name: "Total Carbohydrate",
						amount: "14 g",
						daily_value: 4,

						child_info_item_arr: [

							{
								name: "Dietary fiber",
								amount: "2.4 g",
								daily_value: 9
							},
							{
								name: "Sugar",
								amount: "10 g",
								daily_value: null,
							}

						]

					},
				],
				vitamin_data_arr: [

					{ name: "Vitamin A", 		daily_value: 1, },
					{ name: "Vitamin C", 		daily_value: 7, },
					{ name: "Calcium", 			daily_value: 0, },
					{ name: "Iron", 			daily_value: 0, },
					{ name: "Vitamin D", 		daily_value: 0, },
					{ name: "Vitamin B-6", 		daily_value: 0, },
					{ name: "Cobalamin", 		daily_value: 0, },
					{ name: "Magnesium", 		daily_value: 1, },

				],

			},

		],

	};

	window.main_vm = new Vue({

		el: "#root",
		data: {

			sum: 0,

		},
		methods: {

			init: function ( app ) {

				this.app = app;

				this.app.hub.add_observers( "iframe", {

					set_sum: ( data ) => {

						this.sum = data.sum;

					},

				});

			},

			sidebar_button_click: async function ( button_name ) {

				if ( button_name === "show_nutrition_info_1" ) {

					this.app.controller.send_to_iframe( "show_nutrition_info", {

						nutrition_info: window.data.nutrition_info_arr[ 0 ],

					});

				} else if ( button_name === "show_nutrition_info_2" ) {

					this.app.controller.send_to_iframe( "show_nutrition_info", {

						nutrition_info: window.data.nutrition_info_arr[ 1 ],

					});

				} else if ( button_name.slice( 0, 8 ) === "set_page" ) {

					this.app.controller.send_to_iframe( "set_active_page_name", {

						active_page_name: button_name.slice( 9 ),

					});

				};

			},

		},

	});

	function controller () {

		var _exec = null;
		var _app = null;

		var _state = {

			extension_is_active: false,
			selection_is_active: false,

			selection_data: {

				tbody: null,
				td_1: null,
				coordinates: null,

			},

			sum: 0,

		};

		var _priv = {


		};

		var _pub = {

			init: function ( app ) {

				_app = app;

				var _exec_module = _app.x.modules.exec();
				_exec_module.init( app );

				_exec_module.add_module( "priv", _priv );
				_exec_module.add_module( "pub", _pub );

				_exec_module.add_module( "log", _app.log );
				_exec_module.add_module( "chrome", _app.chrome );
				_exec_module.add_module( "bg_api", _app.bg_api );

				_exec = _exec_module.get_exec();

				_state.iframe_component = _app.iframe_component_external_manager.create_iframe_component_instance( "iframe", "/pages/iframe/index.html" );
				$( "#iframe_container" ).append( _state.iframe_component.element );

				_app.hub.add_observers( "iframe_tester", {

					root_size_change: function ( data ) {

						$( "#iframe_container" ).css({

							width: data.width,
							height: data.height,

						});

					},

				});

			},

			send_to_iframe: function ( name, data ) {

				_state.iframe_component.send_message( name, data );

			},

		};

		return _pub;

	};

	( function ( x ) {

		x.util.load_resources([

			[ "config", "json", "local/config.json" ],

		]).then( ( resources ) => {

			// create the app object which contains useful references for each module

				var config = resources[ "config" ];

				var app = {

					name: "iframe_tester",

					x: x,
					config: config,
					resources: resources,

					log: x.modules.log(),
					hub: x.modules.hub(),
					iframe_component_external_manager: x.modules.iframe_component_external_manager(),

					controller: window.controller(),

				};

			// initialize needed modules

				app.log.init( app );
				app.hub.init( app );
				app.iframe_component_external_manager.init( app );

				app.controller.init( app );

				window.main_vm.init( app );

		});

	} ( window.webextension_library ) );
