<?php
    $title = "Frequently Asked Questions";
    $body_class = "faq-page absolute-body";

    include('../header.php');
?>
    <div class="headline-bg contact-headline-bg faq-headline-bg"></div><!--//headline-bg-->


        <!-- ******Contact Section****** -->
        <section class="contact-section section section-on-bg no-padding">
            <div class="container">
                <h2 class="title text-center">Frequently Asked Questions</h2>
                <p class="intro text-center">The only bad questions are the ones not asked.</p>
                <form id="contact-form" class="contact-form" method="post" action="">
                    <div class="row  contact-other-section">
                        <div class="faq contact-form-inner col-md-8 col-sm-12 col-xs-12 col-md-offset-2 col-sm-offset-0 xs-offset-0" style="background-color:#f4f4f4; border: 0;">
                            <div class="row">
                    <div class=" col-md-8 col-sm-10 col-xs-12 col-md-offset-2 col-sm-offset-1 col-xs-offset-0">
                        <div class="panel">
                            <div class="panel-heading">
                                <h4 class="panel-title"><a data-parent="#accordion"
                                        data-toggle="collapse" class="panel-toggle" href="#faq1"><i class="fa fa-plus-square"></i>Wait, is this free?!</a></h4>
                            </div>

                            <div class="panel-collapse collapse" id="faq1">
                                <div class="panel-body">
                                    Yes, and it will stay that way. We believe in open-source. We're here to make things better for the world.
                                </div>
                            </div>
                        </div><!--//panel-->

                        <div class="panel">
                            <div class="panel-heading">
                                <h4 class="panel-title"><a data-parent="#accordion"
                                        data-toggle="collapse" class="panel-toggle" href="#faq2"><i class="fa fa-plus-square"></i>What happened to TreeConnect? Are you the same?</a></h4>
                            </div>

                            <div class="panel-collapse collapse" id="faq2">
                                <div class="panel-body">
                                    TreeConnect was the nickname given to us by a FamilySearch employee. We were always RecordSeek. So we've done away with the nickname to strengthen the brand and reduce confusion.
                                </div>
                            </div>
                        </div><!--//panel-->

                        <div class="panel">
                            <div class="panel-heading">
                                <h4 class="panel-title"><a data-parent="#accordion"
                                        data-toggle="collapse" class="panel-toggle" href="#faq-mobile"><i class="fa fa-plus-square"></i>Can I use this on my mobile device?</a></h4>
                            </div>

                            <div class="panel-collapse collapse" id="faq-mobile">
                                <div class="panel-body">
                                    Of course! Head over to our <a href="/mobile">mobile install</a> section for complete instructions.
                                </div>
                            </div>
                        </div><!--//panel-->
                    </div>
                </div><!--//row-->
                <div class="contact-lea2d text-center">
                    <h5 style="color: #999;">Have more questions?</h5>
                    <a class="btn btn-cta btn-cta-secondary" href="/contact">Get in touch</a>
                </div>
                        </div>
                    </div><!--//row-->
                    <div id="form-messages"></div>
                </form><!--//contact-form-->
            </div><!--//container-->
        </section><!--//contact-section-->
    </div><!--//wrapper-->
<?php include('../footer.php'); ?>