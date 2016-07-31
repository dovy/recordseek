<?php
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);


    $title        = "Developer Toolkit";
    $body_class   = "developer-page blog-page";
    $header_class = "header-blog";

    include( '../header.php' );
?>
    <div class="blog blog-category container">
        <h2 class="page-title text-center"><i class="fa fa-upload"></i> Attached Files</h2>

        <div class="row">
            <?php
                include( 'files.php' );
            
                if ( empty( $files ) ) {
                    echo "<h3>Wrong page, are you lost?</h3>";
                } else {
                    foreach ( $files as $file ) {
                        ?>
                        <div class="col-md-4 col-xs-6 thumb">
                            <figure class="thumbnail" style="border:none;margin-bottom:5px;">
                                <a href="<?php echo $file; ?>" target="_blank"><img class="img-responsive img-thumbnail" src="<?php echo $file; ?>" alt=""></a>
                            </figure>
                            <div class="caption text-center" style="margin-bottom: 20px;">
                                <span class=" text-muted" style="word-break: break-all;"><?php
                                        $p = explode( '/', $file );
                                        echo end( $p );
                                    ?></span>
                            </div>
                            <!--//post-thumb-->
                        </div>

                        <?php
                    }
                }

            ?>


        </div>
        <!--//row-->
        <div class="pagination-container text-center">
            <ul class="pagination">
                <li class="disabled">&nbsp;</li>
            </ul>
            <!--//pagination-->
        </div>
        <!--//pagination-container-->
    </div>
<?php include( '../call-to-action.php' ); ?>
<?php include( '../footer.php' ); ?>