<?php
    $bookmarklet = "javascript:(function()%7Bjavascript%3A(function(d)%7Bif(typeof%20recordseek%3D%3D'function')%7Brecordseek()%7Delse%7Bvar%20e%3Dd.createElement('script')%3Be.setAttribute('method'%2C'bookmarklet')%3Be.setAttribute('id'%2C'recordseek-bookmarklet')%3Be.setAttribute('version'%2C'1.0')%3Be.setAttribute('src'%2C'%2F%2Fstorage.googleapis.com%2Ffiles.recordseek.com%2Fjs%2F1.0%2Fbookmarklet.js%3Fr%3D'%2BMath.random()*99999999)%3Bd.body.appendChild(e)%7D%7D(document))%7D)()";
    //$bookmarklet = "javascript:void((function(d){e=d.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','//storage.googleapis.com/files.recordseek.com/js/1.0/bookmarklet.js?r='+Math.random()*99999999);d.body.appendChild(e);}(document)));";
    //$bookmarklet = "javascript:(function()%7Bfunction%20h(a)%7Bvar%20g=document.getElementsByTagName('*'),b;for(b%20in%20g)if(-1%3C('%20'+g%5Bb%5D.className+'%20').indexOf('%20'+a+'%20'))return%20g%5Bb%5D%7Dfunction%20e(b)%7Bvar%20a=document.getElementsByTagName('meta');for(i=0;i%3Ca.length;i++)if(a%5Bi%5D.getAttribute('property')==b)return%20a%5Bi%5D.getAttribute('content');return!1%7Dvar%20k='https:'==document.location.protocol?'https://':'http://',a='';h('citation')&&(a=h('citation').getElementsByTagName('p'),0%3Ca.length&&(a=a%5B0%5D.textContent%7C%7Ca%5B0%5D.innerText));var%20b=document.getElementsByTagName('h1'),c='';0%3Cb.length&&(c=b%5B0%5D.textContent%7C%7Cb%5B0%5D.innerText);b=document.title;c&&c.length%3Edocument.title.length&&(b=c);var%20d=''+(window.getSelection?window.getSelection():document.getSelection?document.getSelection():document.selection.createRange().text);''==d&&e('description')?d=e('description'):''==d&&e('og:description')&&(d=e('og:description'));f=k+'recordseek.com/share/?_='+(new%20Date).getTime()+'&url='+encodeURIComponent(window.location.href)+'&h1='+c+'&citation='+encodeURIComponent(a)+'&title='+encodeURIComponent(b)+'&notes='+encodeURIComponent(d);RecordSeek=function()%7Bvar%20a=window.open(f,'rseekwindow','location=1,links=0,scrollbars=0,toolbar=0,width=800,%20height=620,%20top='+(screen.height/2-310)+',%20left='+(screen.width/2-400));a?a.focus():window.location=f%7D;/Firefox/.test(navigator.userAgent)?setTimeout(RecordSeek,0):RecordSeek()%7D)();";
    $file        = $_SERVER['REQUEST_URI'];
    //include( 'bookmarklet/index.php' );
    $bookmarklet = "javascript:(function()%7Bjavascript%3A(function()%7Bfunction%20h(a)%7Bvar%20g%3Ddocument.getElementsByTagName('*')%2Cb%3Bfor(b%20in%20g)if(-1%3C('%20'%2Bg%5Bb%5D.className%2B'%20').indexOf('%20'%2Ba%2B'%20'))return%20g%5Bb%5D%7Dfunction%20e(b)%7Bvar%20a%3Ddocument.getElementsByTagName('meta')%3Bfor(i%3D0%3Bi%3Ca.length%3Bi%2B%2B)if(a%5Bi%5D.getAttribute('property')%3D%3Db)return%20a%5Bi%5D.getAttribute('content')%3Breturn!1%7Dvar%20k%3D'https%3A'%3D%3Ddocument.location.protocol%3F'https%3A%2F%2F'%3A'http%3A%2F%2F'%2Ca%3D''%3Bh('citation')%26%26(a%3Dh('citation').getElementsByTagName('p')%2C0%3Ca.length%26%26(a%3Da%5B0%5D.textContent%7C%7Ca%5B0%5D.innerText))%3Bvar%20b%3Ddocument.getElementsByTagName('h1')%2Cc%3D''%3B0%3Cb.length%26%26(c%3Db%5B0%5D.textContent%7C%7Cb%5B0%5D.innerText)%3Bb%3Ddocument.title%3Bc%26%26c.length%3Edocument.title.length%26%26(b%3Dc)%3Bvar%20d%3D''%2B(window.getSelection%3Fwindow.getSelection()%3Adocument.getSelection%3Fdocument.getSelection()%3Adocument.selection.createRange().text)%3B''%3D%3Dd%26%26e('description')%3Fd%3De('description')%3A''%3D%3Dd%26%26e('og%3Adescription')%26%26(d%3De('og%3Adescription'))%3Bf%3Dk%2B'recordseek.com%2Fshare%2F%3F_%3D'%2B(new%20Date).getTime()%2B'%26url%3D'%2BencodeURIComponent(window.location.href)%2B'%26h1%3D'%2Bc%2B'%26citation%3D'%2BencodeURIComponent(a)%2B'%26title%3D'%2BencodeURIComponent(b)%2B'%26notes%3D'%2BencodeURIComponent(d)%3BRecordSeek%3Dfunction()%7Bvar%20a%3Dwindow.open(f%2C'rseekwindow'%2C'location%3D1%2Clinks%3D0%2Cscrollbars%3D0%2Ctoolbar%3D0%2Cwidth%3D800%2C%20height%3D620%2C%20top%3D'%2B(screen.height%2F2-310)%2B'%2C%20left%3D'%2B(screen.width%2F2-400))%3Ba%3Fa.focus()%3Awindow.location%3Df%7D%3B%2FFirefox%2F.test(navigator.userAgent)%3FsetTimeout(RecordSeek%2C0)%3ARecordSeek()%7D)()%7D)()";
?>

<!DOCTYPE html>
<!--[if IE 8]>
<html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]>
<html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en"> <!--<![endif]-->
<head>
    <title><?php echo isset( $title ) ? $title : 'Citations Simplified' ?> - RecordSeek</title>
    <!-- Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.ico">
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,400italic,500,500italic,700,700italic,900,900italic,300italic,300' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Roboto+Slab:400,700,300,100' rel='stylesheet' type='text/css'>
    <!-- Global CSS -->
    <link rel="stylesheet" href="/assets/plugins/bootstrap/css/bootstrap.min.css">
    <!-- Plugins CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/assets/plugins/flexslider/flexslider.css">
    <!-- Theme CSS -->
    <link id="theme-style" rel="stylesheet" href="/assets/css/styles-2.css">
    <link id="theme-style" rel="stylesheet" href="/assets/css/jssocials.css">
    <link id="theme-style" rel="stylesheet" href="/assets/css/jssocials-theme-flat.css">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries --><!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script><![endif]-->
</head>

<body class="<?php echo isset( $body_class ) ? $body_class : ''; ?>">
<input type="hidden" id="bookmarklet" value="<?php echo $bookmarklet;?>">
<!-- ******HEADER****** -->
<header id="header" class="header <?php echo isset( $header_class ) ? $header_class : 'navbar-fixed-top'; ?>">
    <div class="container">
        <h1 class="logo">
            <a href="/"><span class="text">RecordSeek</span></a>
        </h1><!--//logo-->
        <nav class="main-nav navbar-right" role="navigation">
            <div class="navbar-header">
                <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-collapse">
                    <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span>
                    <span class="icon-bar"></span> <span class="icon-bar"></span>
                </button>
                <!--//nav-toggle-->
            </div>
            <!--//navbar-header-->
            <div id="navbar-collapse" class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li class="<?php if ( $file == "/" ) {
                        echo "active ";
                    } ?>nav-item"><a href="/">Home</a></li>
                    <li class="<?php if ( $file == "/about/" ) {
                        echo "active ";
                    } ?>nav-item"><a href="/about">About</a></li>
                    <li class="<?php if ( $file == "/faq/" ) {
                        echo "active ";
                    } ?>nav-item"><a href="/faq">FAQ</a></li>
                    <li class="<?php if ( $file == "/mobile/" ) {
                        echo "active ";
                    } ?>nav-item"><a href="/mobile">Mobile Install</a></li>
                    <li class="<?php if ( $file == "/contact/" ) {
                        echo "active ";
                    } ?>nav-item"><a href="/contact">Contact</a></li>
                    <!--//dropdown-->
                    <!--<li class="nav-item nav-item-cta last">-->
                    <!--    <a class="btn btn-cta btn-cta-secondary--><?php
                    //        if ( $file == "/get_started/" ) {
                    //            echo " active";
                    //        } ?><!--" href="/get_started">Get Started</a></li>-->
                </ul>
                <!--//nav-->
            </div>
            <!--//navabr-collapse-->
        </nav>
        <!--//main-nav-->
    </div>
    <!--//container-->
</header>
<!--//header-->