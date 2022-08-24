/** Civ5 'fruity' drafter created by HellBlazer, modified by tpelican
 * @author HellBlazer
 * @modifiedby tpelican
 * @date 08.24.2022
 */
$( document ).ready( () => {
	var civSelects = ".America, .Arabia, .Assyria, .Austria, .Aztec, .Babylon, .Brazil, .Byzantium, .Carthage, .Celts, .China, .Denmark, .Egypt, .England, .Ethiopia, .France, .Germany, .Greece, .Huns, .Inca, .India, .Indonesia, .Iroquois, .Japan, .Korea, .Maya, .Mongolia, .Morocco, .Netherlands, .Ottomans, .Persia, .Poland, .Polynesia, .Portugal, .Rome, .Russia, .Shoshone, .Siam, .Songhai, .Spain, .Sweden, .Venetian, .Zulu";
	var civNames = [ "America", "Arabia", "Assyria", "Austria", "Aztec", "Babylon", "Brazil", "Byzantium", "Carthage", "Celts", "China", "Denmark", "Egypt", "England", "Ethiopia", "France", "Germany", "Greece", "Huns", "Inca", "India", "Indonesia", "Iroquois", "Japan", "Korea", "Maya", "Mongolia", "Morocco", "Netherlands", "Ottomans", "Persia", "Poland", "Polynesia", "Portugal", "Rome", "Russia", "Shoshone", "Siam", "Songhai", "Spain", "Sweden", "Venetian", "Zulu" ];
	var allCivs = {};
	civNames.forEach( civ => allCivs[ civ ] = true )

	var bannedCivs = 0;
	var totalCivs = civNames.length;
	var titleHTML = "";
	var allclicked = false;

	// toggle disable or enabled civ
	$( civSelects ).bind( 'click', toggleState )

	/** Toggles the civ
	 * @param {*} e the element
	 */
	function toggleState( e ) {        // function_tr
		if ( !$( this ).is( ':animated' ) ) {
			if ( $( this ).css( 'opacity' ) < 1 ) {
				$( this ).css( "text-decoration", "none" );
				$( this ).css( "background-color", "#282828" );
				$( this ).fadeTo( "slow", 1, () => { } );
				allCivs[ this.className ] = true;
				bannedCivs--;
			} else {
				$( this ).css( "background-color", "#1a1a1a" );
				$( this ).fadeTo( "slow", 0.25, () =>
					$( this ).css( "text-decoration", "line-through" ) );
				allCivs[ this.className ] = false;
				bannedCivs++;
			}
		}
		updateBanned( totalCivs, bannedCivs );
	};

	//reset all to enabled
	$( '#reset' ).click( () => {
		if ( $( '#slideThree' ).is( ':checked' ) ) {
			$( civSelects ).css( {
				"text-decoration": "none",
				"background-color": "#282828"
			} );
			$( civSelects ).fadeTo( "slow", 1, () => { } );

			$.each( allCivs, ( index, value ) => {
				allCivs[ index ] = civSelects.contains( index ) ? false : true;
			} );

			//update the title
			totalCivs = civNames.length;
			bannedCivs = 0;
			updateBanned( totalCivs, bannedCivs );
		} else {
			$( civSelects ).css( {
				"text-decoration": "none",
				"background-color": "#282828"
			} );
			$( civSelects ).fadeTo( "slow", 1, () => { } );
			$.each( allCivs, ( index, value ) => {
				allCivs[ index ] = true;
			} );

			//update the title
			bannedCivs = 0;
			updateBanned( totalCivs, bannedCivs );
		}
		allclicked = false;
		$( '#create' ).attr( "disabled", false );
	} );

	//set all to disabled
	$( '#all' ).click( () => {
		$( civSelects ).fadeTo( "slow", 0.25, () =>
			$( this ).css( { "text-decoration": "line-through", "background-color": "#1a1a1a" } ) );
		$.each( allCivs, ( index, value ) => {
			allCivs[ index ] = false;
		} );

		//update the title
		totalCivs = civNames.length;
		bannedCivs = totalCivs;
		updateBanned( totalCivs, bannedCivs );
		allclicked = true;
	} );

	/** Updates the number of banned civs
	 * @param {*} totalAllowed - the total amount of allowed civs
	 * @param {*} totalBanned - the total amount of banned civs
	 */
	function updateBanned( totalAllowed, totalBanned ) {
		var titleHTML = ( totalAllowed - totalBanned ) + " Allowed - " + totalBanned + " Banned";
		$( ".selectorheadline" ).html( titleHTML );
	}

	// make the draft
	$( '#create' ).click( () => {
		$( '#create' ).attr( "disabled", true );
		var players = $( "#gameplayers option:selected" ).index() + 1;
		var rndpicks = $( "#picks option:selected" ).index() + 1;
		var neededCivs = players * rndpicks;
		var enabledCivs = 0;
		var missingCivs = 0;
		var allowedCivs = [];

		//clear any previous results
		$( "#results" ).empty();

		//check how many civs are enabled
		$.each( allCivs, ( index, value ) => {
			if ( allCivs[ index ] == true ) {
				allowedCivs[ enabledCivs ] = index;
				enabledCivs++;
			};
		} );

		//check if the user is trying to pick more civs than avaliable
		if ( neededCivs > civNames.length ) {
			$( "#results" ).html( "<p class='drawerror'>There are not enough civilizations for " + players + " players to have " + rndpicks + " picks each!</br>Select a different number of players or lower the number of random picks and try again!</p>" );

			// check if we have enough enabled civs process the draft
		} else if ( enabledCivs < neededCivs ) {
			missingCivs = neededCivs - enabledCivs;
			$( "#results" ).html( "<p class='drawerror'>There are not enough available civilizations to make the draw!</br>Please unban at least another " + missingCivs + " civilizations and try again!</p>" );

			// errors handled we can now make the draw
		} else {
			// pick 3 rand civs for each player
			var i;
			var k;
			var picksHTML = "<p class='rescopied'>Draft results have been copied to clipboard</p><table class='drawresults'>";
			var resCopy = ""

			$( "#results" ).css( "text-align", "left" );
			//loop thru each player
			for ( i = 1; i <= players; i++ ) {
				//add this player to the results HTML
				picksHTML = picksHTML + "<tr><td>Player " + i
					+ " choose from:</td>";
				resCopy = resCopy + "Player " + i + " choose from: - ";

				//loop however many picks are needed
				for ( k = 1; k <= rndpicks; k++ ) {
					//loop thru the avlaiable civs and pick 3 at random
					var thisciv = Math.floor(
						Math.random() * allowedCivs.length );
					picksHTML = picksHTML + "<td><img src='img/"
						+ allowedCivs[ thisciv ].toLowerCase()
						+ ".png'></img>" + allowedCivs[ thisciv ];

					if ( k < rndpicks ) {
						picksHTML = picksHTML + "<td>";
						resCopy = resCopy + allowedCivs[ thisciv ] + " or ";
					} else {
						picksHTML = picksHTML + "<td>";
						resCopy = resCopy + allowedCivs[ thisciv ] + "\r\n";
					}

					// remove this item from the array, create new temp array and then assign it to allowed civs						
					enabledCivs = 0;
					var tmpCivs = [];

					$.each( allowedCivs, ( index, value ) => {
						if ( index != thisciv ) {
							tmpCivs[ enabledCivs ] = value;
							enabledCivs++;
						};
					} );
					allowedCivs = tmpCivs.slice();
				}
				picksHTML = picksHTML + "</br>"
			}
			picksHTML = picksHTML + "</table>"
			picksHTML = picksHTML + "<div id='copyresults'><input class='submitbutton' name='copyres' id='copyres' type='button' value='Copy Results' /></div>"

			$( "#results" ).html( picksHTML );
			$( "#copyTarget" ).val( resCopy );
			document.getElementById( "copyres" )
				.addEventListener( "click", () =>
					copyToClipboard( document.getElementById(
						"copyTarget" ) ) );
			$( "#copyres" ).click();

			/** Copies the output to your clipboard
			 * @param {*} elem - the element to copy
			 * @returns true if successful
			 */
			function copyToClipboard( elem ) {
				// create hidden text element, if it doesn't already exist
				var targetId = "_hiddenCopyText_";
				var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
				var origSelectionStart, origSelectionEnd;
				if ( isInput ) {
					// can just use the original source element for the selection and copy
					target = elem;
					origSelectionStart = elem.selectionStart;
					origSelectionEnd = elem.selectionEnd;
				} else {
					// must use a temporary form element for the selection and copy
					target = document.getElementById( targetId );
					if ( !target ) {
						var target = document.createElement( "textarea" );
						target.style.position = "absolute";
						target.style.left = "-9999px";
						target.style.top = "0";
						target.id = targetId;
						document.body.appendChild( target );
					}
					target.textContent = elem.textContent;
				}
				// select the content
				var currentFocus = document.activeElement;
				target.focus();
				target.setSelectionRange( 0, target.value.length );

				// copy the selection
				var succeed;
				try {
					succeed = document.execCommand( "copy" );
				} catch ( e ) {
					succeed = false;
				}
				// restore original focus
				if ( currentFocus && typeof currentFocus.focus === "function" ) {
					currentFocus.focus();
				}

				if ( isInput ) {
					// restore prior selection
					elem.setSelectionRange( origSelectionStart, origSelectionEnd );
				} else {
					// clear temporary content
					target.textContent = "";
				}
				return succeed;
			}
		}
	} );
} );