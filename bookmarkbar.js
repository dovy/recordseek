! function(a, b, c) {
    var d, e, f;
    f = "RSEEK_" + ~~((new Date).getTime() / 864e5), a[f] || (a[f] = !0, a.setTimeout(function() {
        d = b.getElementsByTagName("SCRIPT")[0], e = b.createElement("SCRIPT"), e.type = "text/javascript", e.async = !0, e.src = c, d.parentNode.insertBefore(e, d)
    }, 10))
}(window, document, "//recordseeknew.dev/test.js");