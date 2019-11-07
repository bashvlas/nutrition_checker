
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

	new Vue({

		el: "#root",
		data: {},
		methods: {

			inject_iframe: function () {

				var iframe = document.createElement( "iframe" );
				iframe.src = "/pages/iframe/index.html";
				$( "#iframe_container" ).append( iframe );

			},

			send_to_iframe: function ( name, data ) {

				document.querySelector( "iframe" ).contentWindow.postMessage({ name, data }, "*" );

			},

			sidebar_button_click: async function ( button_name, detail ) {

				if ( button_name === "show_nutrition_info_1" ) {

					this.send_to_iframe( "show_nutrition_info", {

						nutrition_info: window.data.nutrition_info_arr[ 0 ],

					});

				} else if ( button_name === "show_nutrition_info_2" ) {

					this.send_to_iframe( "show_nutrition_info", {

						nutrition_info: window.data.nutrition_info_arr[ 1 ],

					});

				} else if ( button_name === "set_page" ) {

					this.send_to_iframe( "set_active_page_name", {

						active_page_name: detail,

					});

				};

			},

		},

		created: function () {

			window.addEventListener( "message", ( event ) => {

				var name = event.data.name;
				var data = event.data.data;

				console.log( "window_message", name, data );

				if ( name === "root_size_change" ) {

					$( "#iframe_container" ).css({

						width: data.width,
						height: data.height,

					});

				};

			});

			this.inject_iframe();

		},

	});