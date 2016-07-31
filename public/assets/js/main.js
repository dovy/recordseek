$.fn.digits = function() {
    return this.each(
        function() {
            $( this ).text( $( this ).text().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, "$1," ) );
        }
    )
}

$( document ).ready(
    function() {

        /* ======= Twitter Bootstrap hover dropdown ======= */
        /* Ref: https://github.com/CWSpear/bootstrap-hover-dropdown */
        /* apply dropdownHover to all elements with the data-hover="dropdown" attribute */

        $( '[data-hover="dropdown"]' ).dropdownHover();

        /* ======= Fixed header when scrolled ======= */
        $( window ).on(
            'scroll load', function() {

                if ( $( window ).scrollTop() > 0 ) {
                    $( '#header' ).addClass( 'scrolled' );
                }
                else {
                    $( '#header' ).removeClass( 'scrolled' );

                }
            }
        );

        $( '.cta-section' ).waypoint(
            {
                offset: 400,
                handler: function() {
                    var $obj = $( this.element ).find( '.countingNumber' );
                    if ( $obj.text() == "" ) {
                        $( {countNum: $obj.text()} ).animate(
                            {countNum: $obj.attr( 'data-value' )}, {
                                duration: 2500,

                                easing: 'linear',

                                step: function() {
                                    $obj.text( Math.floor( this.countNum ) ).digits();
                                    ;
                                },
                                complete: function() {
                                    $obj.text( this.countNum ).digits();
                                    ;
                                }
                            }
                        );
                    }

                }
            }
        );
        //
        //var waypoint = new Waypoint({
        //    element: document.getElementById('thing'),
        //    handler: function(direction) {
        //        alert('You have scrolled to a thing')
        //    }
        //});
        //
        //$('.countingNumber').each(function(i, $obj) {
        //    $obj = $($obj);
        //    var waypoint = new Waypoint({
        //        element: $obj,
        //        handler: function(direction) {
        //
        //        }
        //    });
        //});


        /* ======= jQuery Placeholder ======= */
        /* Ref: https://github.com/mathiasbynens/jquery-placeholder */

        $( 'input, textarea' ).placeholder();

        /* ======= jQuery FitVids - Responsive Video ======= */
        /* Ref: https://github.com/davatron5000/FitVids.js/blob/master/README.md */

        $( ".video-container" ).fitVids();

        /* ======= FAQ accordion ======= */
        function toggleIcon( e ) {
            $( e.target )
                .prev( '.panel-heading' )
                .find( '.panel-title a' )
                .toggleClass( 'active' )
                .find( "i.fa" )
                .toggleClass( 'fa-plus-square fa-minus-square' );
        }

        $( '.panel' ).on( 'hidden.bs.collapse', toggleIcon );
        $( '.panel' ).on( 'shown.bs.collapse', toggleIcon );


        /* ======= Header Background Slideshow - Flexslider ======= */
        /* Ref: https://github.com/woothemes/FlexSlider/wiki/FlexSlider-Properties */

        $( '.bg-slider' ).flexslider(
            {
                animation: "fade",
                directionNav: false, //remove the default direction-nav - https://github.com/woothemes/FlexSlider/wiki/FlexSlider-Properties
                controlNav: false, //remove the default control-nav
                slideshowSpeed: 8000
            }
        );

        /* ======= Stop Video Playing When Close the Modal Window ====== */
        $( "#modal-video .close" ).on(
            "click", function() {
                $( "#modal-video iframe" ).attr( "src", $( "#modal-video iframe" ).attr( "src" ) );
            }
        );


        /* ======= Testimonial Bootstrap Carousel ======= */
        /* Ref: http://getbootstrap.com/javascript/#carousel */
        $( '#testimonials-carousel' ).carousel(
            {
                interval: 8000
            }
        );


        /* ======= Style Switcher ======= */
        $( '#config-trigger' ).on(
            'click', function( e ) {
                var $panel = $( '#config-panel' );
                var panelVisible = $( '#config-panel' ).is( ':visible' );
                if ( panelVisible ) {
                    $panel.hide();
                } else {
                    $panel.show();
                }
                e.preventDefault();
            }
        );

        $( '#config-close' ).on(
            'click', function( e ) {
                e.preventDefault();
                $( '#config-panel' ).hide();
            }
        );


        $( '#color-options a' ).on(
            'click', function( e ) {
                var $styleSheet = $( this ).attr( 'data-style' );
                $( '#theme-style' ).attr( 'href', $styleSheet );

                var $listItem = $( this ).closest( 'li' );
                $listItem.addClass( 'active' );
                $listItem.siblings().removeClass( 'active' );

                e.preventDefault();

            }
        );

        if ( document.location.pathname == "/mobile/" ) {
            document.location.hash = $( '#bookmarklet' ).val();
            document.title = "RecordSeek"
        } else {
            $( "#share" ).jsSocials(
                {
                    showLabel: true,
                    url: "http://recordseek.com",
                    showCount: true,
                    shares: ["twitter", "facebook", "googleplus", "linkedin", "pinterest"]
                }
            );
        }
    }
);