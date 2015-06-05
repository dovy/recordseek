/*
 Field Google Map
 */

/*global jQuery, document, redux_change, redux*/

(function( $ ) {
    'use strict';

    redux.field_objects = redux.field_objects || {};
    redux.field_objects.google_map = redux.field_objects.google_map || {};

    $( document ).ready(
        function() {

        }
    );

    redux.field_objects.google_map.init = function( selector ) {

        if ( !selector ) {
            selector = $( document ).find( ".redux-group-tab:visible" ).find( '.redux-container-google_map:visible' );
        }

        $( selector ).each(
            function() {

                var el = $( this );
                var parent = el;

                if ( !el.hasClass( 'redux-field-container' ) ) {
                    parent = el.parents( '.redux-field-container:first' );
                }
                if ( parent.is( ":hidden" ) ) { // Skip hidden fields
                    return;
                }
                if ( parent.hasClass( 'redux-field-init' ) ) {
                    parent.removeClass( 'redux-field-init' );
                } else {
                    return;
                }

                el.each('.redux-google_map-init', function(){

                });
            }
        );
    };
})( jQuery );