/*!
 * jQuery Expander Plugin v1.3
 *
 * Date: Sat Sep 17 00:37:34 2011 EDT
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
(function(c){c.expander={version:"1.3",defaults:{slicePoint:100,preserveWords:true,widow:4,expandText:"read more",expandPrefix:"&hellip; ",summaryClass:"summary",detailClass:"details",moreClass:"read-more",lessClass:"read-less",collapseTimer:0,expandEffect:"fadeIn",expandSpeed:250,collapseEffect:"fadeOut",collapseSpeed:200,userCollapse:true,userCollapseText:"read less",userCollapsePrefix:" ",onSlice:null,beforeExpand:null,afterExpand:null,onCollapse:null}};c.fn.expander=function(F){function G(a,e){var g=
"span",h=a.summary;if(e){g="div";h=h.replace(/(<\/[^>]+>)\s*$/,a.moreLabel+"$1");h='<div class="'+a.summaryClass+'">'+h+"</div>"}else h+=a.moreLabel;return[h,"<",g+' class="'+a.detailClass+'"',">",a.details,"</"+g+">"].join("")}function H(a){var e='<span class="'+a.moreClass+'">'+a.expandPrefix;e+='<a href="#">'+a.expandText+"</a></span>";return e}function u(a,e){if(a.lastIndexOf("<")>a.lastIndexOf(">"))a=a.slice(0,a.lastIndexOf("<"));if(e)a=a.replace(I,"");return a}function v(a,e){e.stop(true,true)[a.collapseEffect](a.collapseSpeed,
function(){e.prev("span."+a.moreClass).show().length||e.parent().children("div."+a.summaryClass).show().find("span."+a.moreClass).show()})}function J(a,e,g){if(a.collapseTimer)w=setTimeout(function(){v(a,e);c.isFunction(a.onCollapse)&&a.onCollapse.call(g,false)},a.collapseTimer)}var x=c.extend({},c.expander.defaults,F),K=/^<(?:area|br|col|embed|hr|img|input|link|meta|param).*>$/i,I=/(&(?:[^;]+;)?|\w+)$/,L=/<\/?(\w+)[^>]*>/g,y=/<(\w+)[^>]*>/g,z=/<\/(\w+)>/g,M=/^<[^>]+>.?/,w;this.each(function(){var a,
e,g,h,l,k,n,t,A=[],r=[],o={},p=this,f=c(this),B=c([]),b=c.meta?c.extend({},x,f.data()):x;k=!!f.find("."+b.detailClass).length;var q=!!f.find("*").filter(function(){return/^block|table|list/.test(c(this).css("display"))}).length,s=(q?"div":"span")+"."+b.detailClass,C="span."+b.moreClass,N=b.expandSpeed||0,m=c.trim(f.html());c.trim(f.text());var d=m.slice(0,b.slicePoint);if(!c.data(this,"expander")){c.data(this,"expander",true);c.each(["onSlice","beforeExpand","afterExpand","onCollapse"],function(i,
j){o[j]=c.isFunction(b[j])});d=u(d);for(summTagless=d.replace(L,"").length;summTagless<b.slicePoint;){newChar=m.charAt(d.length);if(newChar=="<")newChar=m.slice(d.length).match(M)[0];d+=newChar;summTagless++}d=u(d,b.preserveWords);h=d.match(y)||[];l=d.match(z)||[];g=[];c.each(h,function(i,j){K.test(j)||g.push(j)});h=g;e=l.length;for(a=0;a<e;a++)l[a]=l[a].replace(z,"$1");c.each(h,function(i,j){var D=j.replace(y,"$1"),E=c.inArray(D,l);if(E===-1){A.push(j);r.push("</"+D+">")}else l.splice(E,1)});r.reverse();
if(k){a=f.find(s).remove().html();d=f.html();m=d+a;k=""}else{a=m.slice(d.length);if(a.split(/\s+/).length<b.widow&&!k)return;k=r.pop()||"";d+=r.join("");a=A.join("")+a}b.moreLabel=f.find(C).length?"":H(b);if(q)a=m;d+=k;b.summary=d;b.details=a;b.lastCloseTag=k;if(o.onSlice)b=(g=b.onSlice.call(p,b))&&g.details?g:b;q=G(b,q);f.html(q);n=f.find(s);t=f.find(C);n.hide();t.find("a").unbind("click.expander").bind("click.expander",function(i){i.preventDefault();t.hide();B.hide();o.beforeExpand&&b.beforeExpand.call(p);
n.stop(false,true)[b.expandEffect](N,function(){n.css({zoom:""});o.afterExpand&&b.afterExpand.call(p);J(b,n,p)})});B=f.find("div."+b.summaryClass);b.userCollapse&&!f.find("span."+b.lessClass).length&&f.find(s).append('<span class="'+b.lessClass+'">'+b.userCollapsePrefix+'<a href="#">'+b.userCollapseText+"</a></span>");f.find("span."+b.lessClass+" a").unbind("click.expander").bind("click.expander",function(i){i.preventDefault();clearTimeout(w);i=c(this).closest(s);v(b,i);o.onCollapse&&b.onCollapse.call(p,
true)})}});return this};c.fn.expander.defaults=c.expander.defaults})(jQuery);
