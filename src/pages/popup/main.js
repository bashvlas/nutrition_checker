
	( function () {

		window.addEventListener( "message", function ( event ) {

			var name = event.data.name;
			var data = event.data.data;

			console.log( name, data );

			if ( name === "close_button_click" ) {

				window.close();

			} else if ( name === "root_size_change" ) {

				$( "body, html" ).css( "width", data.width + "px" );
				$( "body, html" ).css( "height", data.height + "px" );

			};

		});

		setTimeout( () => {

			var iframe = document.createElement( "iframe" );

			iframe.src = "/pages/iframe/index.html";

			iframe.name = "popup";

			document.querySelector( "#root" ).append( iframe );

		}, 1 );

	} () );