<?php
    $title = "Contact Us";
    $body_class = "contact-page absolute-body";

    include('../header.php');
?>
    <div class="headline-bg contact-headline-bg"></div><!--//headline-bg-->


        <!-- ******Contact Section****** -->
        <section class="contact-section section section-on-bg no-padding">
            <div class="container">
                <h2 class="title text-center">Contact Us</h2>
                <p class="intro text-center">We’d love to hear from you.</p>
                <form id="contact-form" class="contact-form" method="post" action="">
                    <div class="row text-center contact-other-section">
                        <div class="contact-form-inner col-md-8 col-sm-12 col-xs-12 col-md-offset-2 col-sm-offset-0 xs-offset-0">
                            <ul class="other-info list-unstyled " style="margin-bottom:0;">
                        <li><i class="fa fa-envelope-o"></i><a href="mailto:me@dovy.io">me@dovy.io</a></li>
                        <li><i class="fa fa-twitter"></i><a href="https://twitter.com/RecordSeek" target="_blank">@RecordSeek</a></li>
                        <li style="margin-bottom: 5px"><i class="fa fa-facebook"></i><a href="https://www.facebook.com/RecordSeek" target="_blank">facebook.com/RecordSeek</a></li>
                    </ul>
                            <div class="row hide">
                                <div class="col-md-6 col-sm-6 col-xs-12 form-group">
                                    <label class="sr-only" for="cname">Your name</label>
                                    <input type="text" class="form-control" id="cname" name="name" placeholder="Your name" minlength="2" required>
                                </div>
                                <div class="col-md-6 col-sm-6 col-xs-12 form-group">
                                    <label class="sr-only" for="cemail">Email address</label>
                                    <input type="email" class="form-control" id="cemail" name="email" placeholder="Your email address" required>
                                </div>
                                <div class="col-md-12 col-sm-12 col-xs-12 form-group">
                                    <label class="sr-only" for="cmessage">Your message</label>
                                    <textarea class="form-control" id="cmessage" name="message" placeholder="Enter your message" rows="12" required></textarea>
                                </div>
                                 <div class="col-md-12 col-sm-12 col-xs-12 form-group">
                                    <button type="submit" class="btn btn-block btn-cta btn-cta-primary">Send Message</button>
                                </div>
                            </div><!--//row-->
                        </div>
                    </div><!--//row-->
                    <div id="form-messages"></div>
                </form><!--//contact-form-->
            </div><!--//container-->
        </section><!--//contact-section-->
    </div><!--//wrapper-->
<?php include('../footer.php'); ?>