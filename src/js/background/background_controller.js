
	function background_controller () {

		var _app = null;
		var _exec = null;

		var _data = {

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

		var _state = {};

		var _priv = {

			get_nutrition_info: ( nutrition_info_arr, food_name ) => {

				for ( var i = nutrition_info_arr.length; i--; ) {

					if ( nutrition_info_arr[ i ].name === food_name ) {

						return nutrition_info_arr[ i ];

					};

				};

				return null;

			},

			init: async ( exec ) => {

				await exec( "chrome", "call", "contextMenus.removeAll" );
				await exec( "chrome", "call", "contextMenus.create", {

					id: "main",
					type: "normal",
					title: "Check nutrition facts of '%s'",
					contexts: [ "selection" ],

				});

			},

			handle_ctx_click: async ( info, tab, exec ) => {

				var ping_result = await exec( "chrome", "call", "tabs.sendMessage", tab.id, { name: "ping" } );
				var text = info.selectionText.toLowerCase();
				var nutrition_info = exec( "priv", "get_nutrition_info", _data.nutrition_info_arr, text );

				if ( ping_result ) {

					exec( "log", "write_exec", "extension_is_running" );

					var extension_is_active = await exec( "chrome", "call", "tabs.sendMessage", tab.id, { name: "get_extension_is_active" } );

					exec( "log", "write_exec", "extension_is_active", extension_is_active );

					if ( extension_is_active ) {

						await exec( "chrome", "call", "tabs.sendMessage", tab.id, { name: "deactivate" } );
						exec( "priv", "show_notification", "deactivate" );

					} else {

						await exec( "chrome", "call", "tabs.sendMessage", tab.id, { name: "activate" } );
						exec( "priv", "show_notification", "activate" );

					};

				} else {

					await exec( "chrome", "call", "tabs.executeScript", tab.id, { allFrames: true, file: "/lib/jquery.min.js" } );
					await exec( "chrome", "call", "tabs.executeScript", tab.id, { allFrames: true, file: "/lib/webx.js" } );
					await exec( "chrome", "call", "tabs.executeScript", tab.id, { allFrames: true, file: "/js/content_scripts/injected_component_module.js" } );
					await exec( "chrome", "call", "tabs.executeScript", tab.id, { allFrames: true, file: "/js/content_scripts/main.js" } );

					exec( "priv", "show_notification", "activate" );

				};

				await exec( "chrome", "call", "tabs.sendMessage", tab.id, {

					name: "show_nutrition_info",
					data: { nutrition_info },

				});

			},

			add_observers: () => {

				chrome.contextMenus.onClicked.addListener( ( info, tab ) => {

					_exec( "priv", "handle_ctx_click", info, tab );

				});

			},

		};

		var _pub = {

			init: ( app ) => {

				_state.app = app;
				_app = app;

				_exec = _app.exec.get_exec( "background_controller" );

				_app.exec.add_module( "background_controller", "priv", _priv )
				_app.exec.add_module( "background_controller", "pub", _pub )
				_app.exec.add_module( "background_controller", "chrome", _app.chrome )

				_exec( "priv", "add_observers" );
				_exec( "priv", "init" );

			}

		};

		return _pub;

	};