<?php
    require __DIR__ . '/vendor/autoload.php';

    //notasecret


    function getService() {
        // Creates and returns the Analytics service object.

        // Use the developers console and replace the values with your
        // service account email, and relative location of your key file.
        $service_account_email = '499240746673-lvfm4fm8olptudao7sgj1r71u6npp28f@developer.gserviceaccount.com';
        $key_file_location     = dirname( __FILE__ ) . '/RecordSeek-a4fa26d313fd.p12';

        // Create and configure a new client object.
        $client = new Google_Client();
        $client->setApplicationName( "RecordSeek" );
        $analytics = new Google_Service_Analytics( $client );

        // Read the generated client_secrets.p12 key.
        $key  = file_get_contents( $key_file_location );
        $cred = new Google_Auth_AssertionCredentials(
            $service_account_email,
            array( Google_Service_Analytics::ANALYTICS_READONLY ),
            $key
        );
        $client->setAssertionCredentials( $cred );
        if ( $client->getAuth()->isAccessTokenExpired() ) {
            $client->getAuth()->refreshTokenWithAssertion( $cred );
        }

        return $analytics;
    }

    function getFirstprofileId( &$analytics ) {


    }

    function getEvents( &$analytics ) {
        $optParams = array(
            'dimensions' => 'ga:eventAction',//, ga:totalEvents
            //'metrics' => 'ga:totalEvents',
            //'sort' => '-ga:sessions,ga:source',
            'filters'    => 'ga:eventCategory==FamilySearch', // , ga:eventAction==SourceCreated
        );

        $data = $analytics->data_ga->get(
            'ga:62071935',
            '2015-06-01',
            date( "Y-m-d" ),//  '2015-07-31',
            'ga:totalEvents',
            $optParams );

        $results = array();
        foreach ( $data->rows as $row ) {
            if ( $row[0] == 'Source Attached' ) {
                $results['attached'] = $row[1];
            }
            if ( $row[0] == 'Source Attached to Another' ) {
                $results['attached_another'] = $row[1];
            }
            if ( $row[0] == 'Source Created' ) {
                $results['created'] = $row[1];
            }
        }

        return $results;
    }

    function getResults( &$analytics, $profileId ) {
        // Calls the Core Reporting API and queries for the number of sessions
        // for the last seven days.
        return $analytics->data_ga->get(
            'ga:' . $profileId,
            '7daysAgo',
            'today',
            'ga:sessions' );
    }


    $cache             = new Gilbitron\Util\SimpleCache();
    $cache->cache_path = dirname( __FILE__ ) . '/cache/';
    $cache->cache_time = 86400;

    if ( $data = $cache->get_cache( 'stats' ) ) {
        $stats = json_decode( $data, true );
    } else {
        $analytics = getService();
        $stats     = getEvents( $analytics );
        $cache->set_cache( 'stats', json_encode( $stats ) );
    }

    if ( isset( $_GET['json'] ) ) {
        echo json_encode( $stats );
    }


