<?php
    $title      = "Get Started";
    $body_class = "get_started-page";

    include( '../header.php' );
?>

    <div class="headline-bg getstarted-headline-bg"></div><!--//headline-bg-->

    <!-- ******Pricing Section****** -->
    <section class="pricing section section-on-bg">
        <div class="container text-center">
            <h2 class="title">Get Started</h2>

            <p class="intro" style="margin-bottom:20px;">Source any website you visit, anytime with the RecordSeek bookmarklet.</p>

            <p><a class="btn btn-cta btn-cta-primary btn-lg" href="<?php echo $bookmarklet; ?>">RecordSeek</a></p>
            <small class="text-muted">Drag this button to your address bar.</small>

        </div>
        <!--//container-->
    </section><!--//pricing-->


    <!-- ******Video Section****** -->
    <section class="story-section section section-on-bg">
        <h2 class="title container text-center">Get Started</h2>

        <div class="story-container container text-center">
            <div class="story-container-inner">
                <div class="developer">
                    <a class="btn btn-cta btn-cta-primary" href="<?php echo $bookmarklet; ?>">RecordSeek</a>

                </div>
                <!--//about-->


            </div>
            <!--//story-container-->
        </div>
        <!--//container-->
    </section>
    <!--//story-video-->
<?php include( '../footer.php' ); ?>