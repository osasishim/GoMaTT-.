(function(){var b=document.getElementById("go");if(!b)return;
var v=function(i){return document.getElementById(i).value};
b.addEventListener("click",function(){location.href="mailto:gomattsolutions@gmail.com?subject="+encodeURIComponent("Enquiry: "+v("s"))+"&body="+encodeURIComponent("Name: "+v("n")+"\n\n"+v("m"))});})();
