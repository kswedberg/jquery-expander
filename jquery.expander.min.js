/*!
 * jQuery Expander Plugin v0.7
 *
 * Date: Wed Aug 31 20:53:59 2011 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2011, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/
(function(c){c.fn.expander=function(w){function q(d){d.hide().prev("span.read-more").show()}function x(d,f,b){if(d.collapseTimer)r=setTimeout(function(){q(f);c.isFunction(d.onCollapse)&&d.onCollapse.call(b,false)},d.collapseTimer)}var s=c.extend({},c.fn.expander.defaults,w),t=/\//,r;this.each(function(){var d,f,b,l=this,j=c(this),a=c.meta?c.extend({},s,j.data()):s,y=a.expandSpeed||0;b=j.html();var e=b.slice(0,a.slicePoint).replace(/(&([^;]+;)?|\w+)$/,"");if(f=e.match(/<\w[^>]*>/g))e=b.slice(0,a.slicePoint+
f.join("").length).replace(/(&([^;]+;)?|\w+)$/,"");if(e.lastIndexOf("<")>e.lastIndexOf(">"))e=e.slice(0,e.lastIndexOf("<"));var m={};c.each(["onSlice","beforeExpand","afterExpand","onCollapse"],function(k,u){m[u]=c.isFunction(a[u])});var h=b.slice(e.length);if(!c(this).find("span.details").length){if(h.replace(/\s+$/,"").split(" ").length<a.widow||b.length<a.slicePoint)return;m.onSlice&&a.onSlice.call(l);if(h.indexOf("</")>-1){b=h.match(/<(\/)?[^>]*>/g);for(var i=0;i<b.length;i++)if(b[i].indexOf("</")>
-1){for(var n,g=false,o=0;o<i;o++){n=b[o].slice(0,b[o].indexOf(" ")).replace(/\w$/,"$1>");if(n==b[i].replace(t,""))g=true}if(!g){e+=b[i];n=false;for(g=f.length-1;g>=0;g--)if(f[g].slice(0,f[g].indexOf(" ")).replace(/(\w)$/,"$1>")==b[i].replace(t,"")&&!n){d=d?f[g]+d:f[g];n=true}}}h=d&&d+h||h}j.html([e,'<span class="read-more">',a.expandPrefix,'<a href="#">',a.expandText,'</a></span><span class="details">',h,"</span>"].join(""))}var p=c(this).find("span.details"),v=c(this).find("span.read-more");p.hide();
v.find("a").bind("click.expander",function(k){k.preventDefault();v.hide();m.beforeExpand&&a.beforeExpand.call(l);p[a.expandEffect](y,function(){p.css({zoom:""});m.afterExpand&&a.afterExpand.call(l);x(a,p,l)})});if(a.userCollapse&&!j.find("span.re-collapse").length){j.find("span.details").append('<span class="re-collapse">'+a.userCollapsePrefix+'<a href="#">'+a.userCollapseText+"</a></span>");j.find("span.re-collapse a").bind("click.expander",function(k){k.preventDefault();clearTimeout(r);k=c(this).parents("span.details");
q(k);m.onCollapse&&a.onCollapse.call(l,true)})}});return this};c.fn.expander.defaults={slicePoint:100,widow:4,expandText:"read more",expandPrefix:"&hellip; ",collapseTimer:0,expandEffect:"fadeIn",expandSpeed:250,userCollapse:true,userCollapseText:"[collapse expanded text]",userCollapsePrefix:" ",onSlice:null,beforeExpand:null,afterExpand:null,onCollapse:null}})(jQuery);
