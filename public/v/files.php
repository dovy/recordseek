<?php
    require_once __DIR__ . '/vendor/autoload.php';
// set_error_handler(function ($errorNumber, $message, $errfile, $errline) {
//     switch ($errorNumber) {
//         case E_ERROR :
//             $errorLevel = 'Error';
//             break;

//         case E_WARNING :
//             $errorLevel = 'Warning';
//             break;

//         case E_NOTICE :
//             $errorLevel = 'Notice';
//             break;

//         default :
//             $errorLevel = 'Undefined';
//     }

//     echo '<br/><b>' . $errorLevel . '</b>: ' . $message . ' in <b>'.$errfile . '</b> on line <b>' . $errline . '</b><br/>';
// });

    use Google\Cloud\Storage\StorageClient;

    $key = file_get_contents('../../RecordSeek-08fd4f73beed.json');

    $storage = new StorageClient(
        [
            'projectId' => 'recordseek',
            'keyFile'=> $key // Load contents of permissions here
        ]
    );


    $bucket = $storage->bucket( 'files.recordseek.com' );

    $path = str_replace( array( 'v/', '//' ), '', $_SERVER['REQUEST_URI'] . '/' );

    //$path = "/MMM3-6Z3K/";
    //if (isset($_GET['path']) && !empty($_GET['path'])) {
    //
    //    $path = implode('/',$_GET['path']);
    //}
    //if ($path[0] != "/") {
    //    $path = "/".$path;
    //}
    $files = [];
    if (!empty($path)) {
        $objects = $bucket->objects( [
            'prefix' => 'uploads' . $path,
            'fields' => 'items/name,nextPageToken'
        ] );
        if ( ! empty( $objects ) ) {
            foreach ( $objects as $object ) {
                $files[] = 'https://storage.googleapis.com/files.recordseek.com/' . $object->getName();
            }
        }
    }





