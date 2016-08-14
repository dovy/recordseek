<?php
    // Routes

    //$app->get( '/[{name}]', function ( $request, $response, $args ) {
    //    // Sample log message
    //    $this->logger->info( "Slim-Skeleton '/' route" );
    //
    //    // Render index view
    //    return $this->renderer->render( $response, 'index.phtml', $args );
    //} );


    // Define app routes
    $app->get( '/user/{contrib_id}', function ( $request, $response, $args ) {
        return $response->withJson( "Hello " . $args['contrib_id'] );
    } );