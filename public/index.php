<?php
    $title = "Citations Simplified";
    include( 'header.php' );
?>

    <div class="bg-slider-wrapper">
        <div class="flexslider bg-slider">
            <ul class="slides">
                <li class="slide slide-1"></li>
                <li class="slide slide-2"></li>
                <li class="slide slide-3"></li>
            </ul>
        </div>
    </div>
    <!--//bg-slider-wrapper-->

    <section class="promo section section-on-bg">
        <div class="container text-center">
            <h2 class="title">Record a website as a source,<br/>with virtually no effort.</h2>

            <p class="intro">RecordSeek makes it effortless to record your source citations from the web. Get started, and start saving sources.</p>

            <p><a class="btn btn-cta btn-cta-primary" href="<?php echo $bookmarklet;?>">RecordSeek</a></p>
            <small class="text-muted">Drag the "recordseek" button above to your address bar.</small>
            <button type="button" class="play-trigger btn-link hide" data-toggle="modal" data-target="#modal-video">
                <i class="fa fa-youtube-play"></i> Watch the video
            </button>
        </div>
        <!--//container-->
    </section>
    <!--//promo-->

    <div class="sections-wrapper">


        <!-- ******Why Section****** -->
        <section id="why" class="section why no-padding">
            <div class="container">
                <h2 class="title text-center">How Can RecordSeek Help You?</h2>

                <p class="intro text-center">We make it effortless to record a source so you can spend more time researching.</p>

                <div class="row item">
                    <div class="content col-md-4 col-sm-12 col-xs-12">
                        <h3 class="title">Save you time and effort</h3>

                        <div class="desc">
                            <p>We take any website on the net, and convert it to a source citation automatically. With the help of our technology recording sources becomes a joy, rather than a struggle.</p>

                            <p>RecordSeek automatically creates a MLA format source citation for you, so you get the benefit of an official citation, without the frustration.</p>
                        </div>
                        <div class="quote">
                            <div class="quote-profile">
                                <img class="img-responsive img-circle" src="/assets/images/people/dovy.png" alt=""/>
                            </div>
                            <!--//profile-->
                            <div class="quote-content">
                                <blockquote>
                                    <p>RecordSeek was created to save time and make a broken process simple.</p>
                                </blockquote>
                                <p class="source">Dovy Paukstys, <small>Creator</small></p>
                            </div>
                            <!--//quote-content-->
                        </div>
                        <!--//quote-->
                    </div>
                    <!--//content-->
                    <figure class="figure col-md-7 col-sm-12 col-xs-12 col-md-offset-1 col-sm-offset-0 col-xs-offset-0">
                        <img class="img-responsive" src="/assets/images/figures/recordseek.png" alt=""/>
                        <figcaption class="figure-caption">(Screenshot: RecordSeek launch page)</figcaption>
                    </figure>
                </div>
                <!--//item-->


                <div class="row item">
                    <div class="content col-md-4 col-sm-12 col-xs-12 col-md-push-8 col-sm-push-0 col-xs-push-0">
                        <h3 class="title">Works everywhere</h3>

                        <div class="desc">
                            <p>RecordSeek has been designed to work for mobile as well as desktop uses. With a few simple instructions you can use RecordSeek on the go.</p>

                            <p>And with the simplicity of our bookmarklet, you can go to any library and be using RecordSeek without installing a thing. Portability is important to us.</p>

                            <p class="hide"><i class="fa fa-book"></i> <a href="get_started/">Installation Instructions</a></p>
                        </div>
                    </div>
                    <!--//content-->
                    <figure class="figure col-md-7 col-sm-12 col-xs-12 col-md-pull-4 col-sm-pull-0 col-xs-pull-0">
                        <img class="img-responsive" src="/assets/images/figures/responsive.png" alt=""/>

                        <div class="control text-center">
                            <button type="button" class="play-trigger hide" data-toggle="modal" data-target="#modal-video">
                                <i class="fa fa-play"></i></button>
                        </div>
                        <!--//control-->
                    </figure>
                </div>
                <!--//item-->
            </div>
        </section>
        <?php
            include( 'call-to-action.php' );
            $no_cta = true;
        ?>
        <!-- ******Why Section****** -->
        <section id="why2" class="section why">
            <div class="container">
                <div class="row item ">
                    <div class="content col-md-4 col-sm-12 col-xs-12">
                        <h3 class="title">FamilySearch & Ancestry</h3>

                        <div class="desc">
                            <p>We aim to support the biggest players in the industry. Currently RecordSeek allows you to link your sources to
                                <a href="http://familysearch.org" target="_blank">FamilySearch</a> or
                                <a href="http://ancestry.com" target="_blank">Ancestry</a>. We'll gladly expand our integrations to others.
                            </p>

                            <p>Working together we can build a complete solution for users and developers across the world.</p>
                        </div>

                    </div>
                    <!--//content-->
                    <figure class="figure col-md-7 col-sm-12 col-xs-12 col-md-offset-1 col-sm-offset-0 col-xs-offset-0">
                        <img class="img-responsive" src="/assets/images/figures/ancestryfs.png" alt=""/>
                        <figcaption class="figure-caption">(Screenshot:
                            <a href="http://familysearch.org" target="_blank">FamilySearch.org</a> and
                            <a href="http://ancestry.com" target="_blank">Ancestry.com)</a></figcaption>

                    </figure>
                </div>
                <!--//item-->

                <div class="row item last-item">
                    <div class="content col-md-4 col-sm-12 col-xs-12 col-md-push-8 col-sm-push-0 col-xs-push-0">
                        <h3 class="title">Collaborate with others</h3>

                        <div class="desc">
                            <p>The whole reason we cite sources is to ensure we don't duplicate effort. With our help you ensure others are not looking for the same records you are.</p>

                            <p>With citations, family fiction fades away. We all want to prove our ancestors existed, so why not work together?</p>

                            <div class="quote">
                                <div class="quote-content no-arrow">
                                    <blockquote>
                                        <p>Teamwork is the ability to work together toward a common vision. The ability to direct individual accomplishments toward organizational objectives. It is the fuel that allows common people to attain uncommon results.</p>
                                    </blockquote>
                                    <p class="source">Andrew Carnegie</p>
                                </div>
                            </div>
                            <!--//quote-->
                        </div>


                    </div>
                    <!--//content-->
                    <figure class="figure col-md-7 col-sm-12 col-xs-12 col-md-pull-4 col-sm-pull-0 col-xs-pull-0">
                        <img class="img-responsive" src="/assets/images/figures/map.png" alt=""/>
                    </figure>
                </div>
                <!--//item-->

                <div class="feature-lead text-center hide">
                    <h4 class="title">Want to discover all the features?</h4>

                    <p><a class="btn btn-cta btn-cta-secondary" href="features/">Take a Tour</a></p>
                </div>
            </div>
            <!--//container-->
        </section>
        <!--//why-->

        <!-- ******Testimonials Section****** -->
        <section class="section testimonials">
            <div class="container">
                <h2 class="title text-center">What are people saying about RecordSeek?</h2>

                <div id="testimonials-carousel" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#testimonials-carousel" data-slide-to="0" class="active"></li>
                        <li data-target="#testimonials-carousel" data-slide-to="1"></li>
                    </ol>
                    <!--//carousel-indicators-->
                    <div class="carousel-inner">
                        <div class="item active">
                            <figure class="profile"><img src="/assets/images/people/luisa-m.png" alt=""/></figure>
                            <div class="content">
                                <blockquote>
                                    <i class="fa fa-quote-left"></i>

                                    <p>I just seriously needed to thank you so much for RecordSeek. I love it so much and use it hundreds of times a day it seems. It has made family history so much easier and I am so grateful that you have developed it.</p>
                                </blockquote>
                                <p class="source">Luisa</p>
                            </div>
                            <!--//content-->
                        </div>
                        <!--//item-->
                        <div class="item">
                            <div class="content">
                                <blockquote>
                                    <i class="fa fa-quote-left"></i>

                                    <p>If you have ever found or stumbled onto a great document, picture or website of information about one of your ancestors, and did not know how to create a source on familysearch, or on Ancestry.com, now you can do it with a few mouse clicks and no technical expertise or programming knowledge needed. The tool does all of the heavy lifting, all you need to do is identify your ancestor so the documentation link can be attached.</p>
                                </blockquote>
                                <p class="source">David Penrod</p>
                            </div>
                            <!--//content-->
                        </div>
                        <!--//item-->

                    </div>
                    <!--//carousel-inner-->

                </div>
                <!--//carousel-->
            </div>
            <!--//container-->
        </section>
        <!--//testimonials-->

        <!-- ******Press Section****** -->
        <section class="section press">
            <div class="container text-center">
                <h2 class="title">Press Coverage</h2>
                <ul class="press-list list-inline row last">
                    <?php
                        $press = array(
                            '2013-11-15' => array(
                                'title' => 'Tree Connect by RecordSeek',
                                'source' => 'Genealogy Bank',
                                'url' => 'http://blog.genealogybank.com/great-family-tree-genealogy-app-tree-connect-by-recordseek.html'
                            ),
                            '2013-01-25' => array(
                                'title' => 'Using RecordSeek to Add Sources to the FamilySearch Family Tree',
                                'source' => 'Genea-Musings',
                                'url' => 'http://www.geneamusings.com/2013/01/using-recordseek-to-add-sources-to.html'
                            ),
                            '2015-07-06' => array(
                                'title' => 'Gathering Source information with RecordSeek',
                                'source' => 'Genealogy\'s Star',
                                'url' => 'http://genealogysstar.blogspot.com/2015/07/gathering-source-information-with.html'
                            ),
                            '2015-06-06' => array(
                                'title' => 'Newly Updated RecordSeek Tree Connect is back',
                                'source' => 'Rejoice, and be exceedingly glad...',
                                'url' => 'http://rejoiceandbeexceedingglad.blogspot.com/2015/06/newly-updated-recordseek-tree-connect.html'
                            ),
                            '2013-03-01' => array(
                                'title' => 'RecordSeek automates adding sources to FamilySearch Family Tree',
                                'source' => 'Genealogy\'s Star',
                                'url' => 'http://genealogysstar.blogspot.com/2013/03/recordseek-automates-adding-sources-to.html'
                            ),
                            '2015-04-05' => array(
                                'title' => 'The FamilyTree Certified Programs',
                                'source' => 'Utah Valley Technology and Genealogy Group',
                                'url' => 'http://uvtagg.org/classes/dons/dons-familytreecertifiedprograms.html'
                            ),
                            '2015-07-13' => array(
                                'title' => 'RecordSeek: Add an online source to FamilySearch or Ancestry',
                                'source' => 'Free Genealogy Help',
                                'url' => 'http://www.freegenealogyhelp.com/recordseek-add-an-online-source-to-familysearch-or-ancestry/'
                            ),
                            array(
                                'source' => 'Pinterest',
                                'url' => 'https://www.pinterest.com/ofsltraining/recordseek-tree-connect/'
                            ),
                            '2015-07-05' => array(
                                'title' => 'RecordSeek, Redesigned From the Ground Up - More Power, Same Product',
                                'source' => 'Dovy.io',
                                'url' => 'http://dovy.io/recordseek/recordseek-redesigned-from-the-ground-up/'
                            ),
                        );

                        ksort($press);

                        foreach($press as $date => $data) {
                            ?>
                            <li class="col-md-4 col-sm-4 col-xs-4">
                                <a href="<?php echo $data['url']?>" title="<?php echo isset($data['title'])?$data['title']:'';?>" class="text-muted" target="_blank"><?php echo $data['source'];?></a> <i class="fa fa-external-link"></i></li>
                            <?php
                        }

                    ?>

                </ul>


                <div class="press-lead text-center">
                    <h3 class="title">Have press inquires?</h3>

                    <p class="press-links"><a href="about/">Grab our Press Materials</a> or
                        <a href="contact/">get in touch</a>
                    </p>
                </div>

            </div>
            <!--//container-->
        </section>
        <!--//press-->

        <!-- ******CTA Section****** -->
        <section id="cta-section" class="section cta-section text-center home-cta-section">
            <div class="container">
                <h2 class="title">Developers: Are you ready to integrate <br/>RecordSeek on your website?</h2>

                <p class="intro"><span class="counting">Don't waste time!</span> Use our technology to <br/>connect your records to the services we support.</p>

                <p>
                    <a class="btn btn-cta btn-cta-primary" href="developers/">Developer Toolkit</a>
                </p>
            </div>
            <!--//container-->
        </section>
        <!--//cta-section-->

    </div>
    <!--//section-wrapper-->

<?php include( 'footer.php' ); ?>