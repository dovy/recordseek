<?php
    if ( ! isset( $no_cta ) ) {
        include_once( 'stats/index.php' );
        ?>

        <!-- ******CTA Section****** -->
        <section class="section cta-section text-center pricing-cta-section">
            <div class="container">
                <h2 class="title">Over
                    <span class="countingNumber" data-value="<?php echo $stats['created'] ?>"></span> Sources Created
                    <!--<br /><small style="font-size:.5em">--><?php //echo number_format($stats['created']); ?><!-- Sources Created on Partner Sites</small>-->
                </h2>

                <p class="intro">What are you waiting for? <br/></p>
                <p><a class="btn btn-cta btn-cta-primary btn-lg" href="<?php echo $bookmarklet; ?>">RecordSeek</a></p>
                <small class="text-muted">Drag this button to your address bar.</small>


            </div>
            <!--//container-->
        </section><!--//cta-section-->
    <?php } ?>