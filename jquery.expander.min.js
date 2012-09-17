/*!
 * jQuery Expander Plugin v1.4.4
 *
 * Date: Sun Sep 16 21:07:05 2012 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2011, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 *
 *
 *
*/
(function(c){c.expander={version:"1.4.4",defaults:{slicePoint:100,preserveWords:true,widow:4,expandText:"read more",expandPrefix:"&hellip; ",expandAfterSummary:false,summaryClass:"summary",detailClass:"details",moreClass:"read-more",lessClass:"read-less",collapseTimer:0,expandEffect:"slideDown",expandSpeed:250,collapseEffect:"slideUp",collapseSpeed:200,userCollapse:true,userCollapseText:"read less",userCollapsePrefix:" ",onSlice:null,beforeExpand:null,afterExpand:null,onCollapse:null}};c.fn.expander=
function(l){function I(a,d){var e="span",h=a.summary;if(d){e="div";if(x.test(h)&&!a.expandAfterSummary)h=h.replace(x,a.moreLabel+"$1");else h+=a.moreLabel;h='<div class="'+a.summaryClass+'">'+h+"</div>"}else h+=a.moreLabel;return[h,"<",e+' class="'+a.detailClass+'"',">",a.details,"</"+e+">"].join("")}function J(a){var d='<span class="'+a.moreClass+'">'+a.expandPrefix;d+='<a href="#">'+a.expandText+"</a></span>";return d}function y(a,d){if(a.lastIndexOf("<")>a.lastIndexOf(">"))a=a.slice(0,a.lastIndexOf("<"));
if(d)a=a.replace(K,"");return c.trim(a)}function z(a,d){d.stop(true,true)[a.collapseEffect](a.collapseSpeed,function(){d.prev("span."+a.moreClass).show().length||d.parent().children("div."+a.summaryClass).show().find("span."+a.moreClass).show()})}function L(a,d,e){if(a.collapseTimer)A=setTimeout(function(){z(a,d);c.isFunction(a.onCollapse)&&a.onCollapse.call(e,false)},a.collapseTimer)}var u="init";if(typeof l=="string"){u=l;l={}}var v=c.extend({},c.expander.defaults,l),M=/^<(?:area|br|col|embed|hr|img|input|link|meta|param).*>$/i,
K=v.wordEnd||/(&(?:[^;]+;)?|[a-zA-Z\u00C0-\u0100]+)$/,B=/<\/?(\w+)[^>]*>/g,C=/<(\w+)[^>]*>/g,D=/<\/(\w+)>/g,x=/(<\/[^>]+>)\s*$/,N=/^<[^>]+>.?/,A;l={init:function(){this.each(function(){var a,d,e,h,m,i,o,w,E=[],s=[],p={},q=this,f=c(this),F=c([]),b=c.extend({},v,f.data("expander")||c.meta&&f.data()||{});i=!!f.find("."+b.detailClass).length;var r=!!f.find("*").filter(function(){return/^block|table|list/.test(c(this).css("display"))}).length,t=(r?"div":"span")+"."+b.detailClass;a=b.moreClass+"";d=b.lessClass+
"";var O=b.expandSpeed||0,n=c.trim(f.html());c.trim(f.text());var g=n.slice(0,b.slicePoint);b.moreSelector="span."+a.split(" ").join(".");b.lessSelector="span."+d.split(" ").join(".");if(!c.data(this,"expanderInit")){c.data(this,"expanderInit",true);c.data(this,"expander",b);c.each(["onSlice","beforeExpand","afterExpand","onCollapse"],function(j,k){p[k]=c.isFunction(b[k])});g=y(g);for(d=g.replace(B,"").length;d<b.slicePoint;){a=n.charAt(g.length);if(a=="<")a=n.slice(g.length).match(N)[0];g+=a;d++}g=
y(g,b.preserveWords);h=g.match(C)||[];m=g.match(D)||[];e=[];c.each(h,function(j,k){M.test(k)||e.push(k)});h=e;d=m.length;for(a=0;a<d;a++)m[a]=m[a].replace(D,"$1");c.each(h,function(j,k){var G=k.replace(C,"$1"),H=c.inArray(G,m);if(H===-1){E.push(k);s.push("</"+G+">")}else m.splice(H,1)});s.reverse();if(i){i=f.find(t).remove().html();g=f.html();n=g+i;a=""}else{i=n.slice(g.length);a=c.trim(i.replace(B,""));if(a===""||a.split(/\s+/).length<b.widow)return;a=s.pop()||"";g+=s.join("");i=E.join("")+i}b.moreLabel=
f.find(b.moreSelector).length?"":J(b);if(r)i=n;g+=a;b.summary=g;b.details=i;b.lastCloseTag=a;if(p.onSlice)b=(e=b.onSlice.call(q,b))&&e.details?e:b;r=I(b,r);f.html(r);o=f.find(t);w=f.find(b.moreSelector);o[b.collapseEffect](0);w.find("a").unbind("click.expander").bind("click.expander",function(j){j.preventDefault();w.hide();F.hide();p.beforeExpand&&b.beforeExpand.call(q);o.stop(false,true)[b.expandEffect](O,function(){o.css({zoom:""});p.afterExpand&&b.afterExpand.call(q);L(b,o,q)})});F=f.find("div."+
b.summaryClass);b.userCollapse&&!f.find(b.lessSelector).length&&f.find(t).append('<span class="'+b.lessClass+'">'+b.userCollapsePrefix+'<a href="#">'+b.userCollapseText+"</a></span>");f.find(b.lessSelector+" a").unbind("click.expander").bind("click.expander",function(j){j.preventDefault();clearTimeout(A);j=c(this).closest(t);z(b,j);p.onCollapse&&b.onCollapse.call(q,true)})}})},destroy:function(){this.each(function(){var a,d,e=c(this);if(e.data("expanderInit")){a=c.extend({},e.data("expander")||{},
v);d=e.find("."+a.detailClass).contents();e.removeData("expanderInit");e.removeData("expander");e.find(a.moreSelector).remove();e.find("."+a.summaryClass).remove();e.find("."+a.detailClass).after(d).remove();e.find(a.lessSelector).remove()}})}};l[u]&&l[u].call(this);return this};c.fn.expander.defaults=c.expander.defaults})(jQuery);
