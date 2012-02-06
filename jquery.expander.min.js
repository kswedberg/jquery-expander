/*!
 * jQuery Expander Plugin v1.4.1
 *
 * Date: Mon Feb 06 14:25:11 2012 EST
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
(function(c){c.expander={version:"1.4.1",defaults:{slicePoint:100,preserveWords:true,widow:4,expandText:"read more",expandPrefix:"&hellip; ",expandAfterSummary:false,summaryClass:"summary",detailClass:"details",moreClass:"read-more",lessClass:"read-less",collapseTimer:0,expandEffect:"fadeIn",expandSpeed:250,collapseEffect:"fadeOut",collapseSpeed:200,userCollapse:true,userCollapseText:"read less",userCollapsePrefix:" ",onSlice:null,beforeExpand:null,afterExpand:null,onCollapse:null}};c.fn.expander=
function(k){function I(a,d){var g="span",h=a.summary;if(d){g="div";if(x.test(h)&&!a.expandAfterSummary)h=h.replace(x,a.moreLabel+"$1");else h+=a.moreLabel;h='<div class="'+a.summaryClass+'">'+h+"</div>"}else h+=a.moreLabel;return[h,"<",g+' class="'+a.detailClass+'"',">",a.details,"</"+g+">"].join("")}function J(a){var d='<span class="'+a.moreClass+'">'+a.expandPrefix;d+='<a href="#">'+a.expandText+"</a></span>";return d}function y(a,d){if(a.lastIndexOf("<")>a.lastIndexOf(">"))a=a.slice(0,a.lastIndexOf("<"));
if(d)a=a.replace(K,"");return a}function z(a,d){d.stop(true,true)[a.collapseEffect](a.collapseSpeed,function(){d.prev("span."+a.moreClass).show().length||d.parent().children("div."+a.summaryClass).show().find("span."+a.moreClass).show()})}function L(a,d,g){if(a.collapseTimer)A=setTimeout(function(){z(a,d);c.isFunction(a.onCollapse)&&a.onCollapse.call(g,false)},a.collapseTimer)}var v="init";if(typeof k=="string"){v=k;k={}}var o=c.extend({},c.expander.defaults,k),M=/^<(?:area|br|col|embed|hr|img|input|link|meta|param).*>$/i,
K=o.wordEnd||/(&(?:[^;]+;)?|[a-zA-Z\u00C0-\u0100]+)$/,N=/<\/?(\w+)[^>]*>/g,B=/<(\w+)[^>]*>/g,C=/<\/(\w+)>/g,x=/(<\/[^>]+>)\s*$/,O=/^<[^>]+>.?/,A;k={init:function(){this.each(function(){var a,d,g,h,l,m,p,w,D=[],t=[],q={},r=this,f=c(this),E=c([]),b=c.meta?c.extend({},o,f.data()):o;m=!!f.find("."+b.detailClass).length;var s=!!f.find("*").filter(function(){return/^block|table|list/.test(c(this).css("display"))}).length,u=(s?"div":"span")+"."+b.detailClass,F="span."+b.moreClass,P=b.expandSpeed||0,n=c.trim(f.html());
c.trim(f.text());var e=n.slice(0,b.slicePoint);if(!c.data(this,"expander")){c.data(this,"expander",true);c.each(["onSlice","beforeExpand","afterExpand","onCollapse"],function(i,j){q[j]=c.isFunction(b[j])});e=y(e);for(d=e.replace(N,"").length;d<b.slicePoint;){a=n.charAt(e.length);if(a=="<")a=n.slice(e.length).match(O)[0];e+=a;d++}e=y(e,b.preserveWords);h=e.match(B)||[];l=e.match(C)||[];g=[];c.each(h,function(i,j){M.test(j)||g.push(j)});h=g;d=l.length;for(a=0;a<d;a++)l[a]=l[a].replace(C,"$1");c.each(h,
function(i,j){var G=j.replace(B,"$1"),H=c.inArray(G,l);if(H===-1){D.push(j);t.push("</"+G+">")}else l.splice(H,1)});t.reverse();if(m){a=f.find(u).remove().html();e=f.html();n=e+a;m=""}else{a=n.slice(e.length);if(a===""||a.split(/\s+/).length<b.widow)return;m=t.pop()||"";e+=t.join("");a=D.join("")+a}b.moreLabel=f.find(F).length?"":J(b);if(s)a=n;e+=m;b.summary=e;b.details=a;b.lastCloseTag=m;if(q.onSlice)b=(g=b.onSlice.call(r,b))&&g.details?g:b;s=I(b,s);f.html(s);p=f.find(u);w=f.find(F);p.hide();w.find("a").unbind("click.expander").bind("click.expander",
function(i){i.preventDefault();w.hide();E.hide();q.beforeExpand&&b.beforeExpand.call(r);p.stop(false,true)[b.expandEffect](P,function(){p.css({zoom:""});q.afterExpand&&b.afterExpand.call(r);L(b,p,r)})});E=f.find("div."+b.summaryClass);b.userCollapse&&!f.find("span."+b.lessClass).length&&f.find(u).append('<span class="'+b.lessClass+'">'+b.userCollapsePrefix+'<a href="#">'+b.userCollapseText+"</a></span>");f.find("span."+b.lessClass+" a").unbind("click.expander").bind("click.expander",function(i){i.preventDefault();
clearTimeout(A);i=c(this).closest(u);z(b,i);q.onCollapse&&b.onCollapse.call(r,true)})}})},destroy:function(){if(this.data("expander")){this.removeData("expander");this.each(function(){var a=c(this),d=c.meta?c.extend({},o,a.data()):o,g=a.find("."+d.detailClass).contents();a.find("."+d.moreClass).remove();a.find("."+d.summaryClass).remove();a.find("."+d.detailClass).after(g).remove();a.find("."+d.lessClass).remove()})}}};k[v]&&k[v].call(this);return this};c.fn.expander.defaults=c.expander.defaults})(jQuery);
