navigator.serviceWorker.register('/sw.js');

(function() {
  var lastHtml = '';
  var checkIntervalSeconds = 30;
  function checkCurrent() {
    var now = Date.now();
    // Ensure that we bypass the CDN cache on every refresh interval.
    var queryString = now - now % checkIntervalSeconds;
    fetch(location.href + '?' + queryString, {cache: 'reload'}).then(function(response) {
      if (!response.ok) {
        console.error('Check failed', response);
        return;
      }
      response.text().then(function(text) {
        if (lastHtml == text) {
          console.info('HTML unchanged');
          return;
        }
        lastHtml = text;
        console.info('Updating html');
        var d = new DOMParser()
        var doc = d.parseFromString(text, 'text/html');
        if (doc.documentElement.getAttribute('version') != 
            document.documentElement.getAttribute('version')) {
          location.reload();
          return;
        }
        setDOM(document, doc.documentElement);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', checkCurrent);
  window.addEventListener('focus', checkCurrent);
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      checkCurrent();
    }
  })
  setInterval(checkCurrent, 1000 * checkIntervalSeconds);
  setInterval(function() {
    fetch(location.href) // Keep the ServiceWorker cache fresh
  }, 1000 * 60 * 5);

})();

// setDOM from https://github.com/DylanPiercey/set-dom under MIT License
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).setDOM=e()}}(function(){return function e(t,n,r){function i(d,a){if(!n[d]){if(!t[d]){var f="function"==typeof require&&require;if(!a&&f)return f(d,!0);if(o)return o(d,!0);var u=new Error("Cannot find module '"+d+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[d]={exports:{}};t[d][0].call(l.exports,function(e){var n=t[d][1][e];return i(n||e)},l,l.exports,e,t,n,r)}return n[d].exports}for(var o="function"==typeof require&&require,d=0;d<r.length;d++)i(r[d]);return i}({1:[function(e,t){"use strict";function n(e,t){!function(e,t){if(!e)throw new Error("set-dom: "+t)}(e&&e.nodeType,"You must provide a valid node to update."),e.nodeType===h&&(e=e.documentElement),t.nodeType===v?i(e,t):r(e,"string"==typeof t?s(t,e.nodeName):t),e[m]||(e[m]=!0,f(e))}function r(e,t){if(e.nodeType===t.nodeType)if(e.nodeType===p){if(function(e,t){return a(e)&&a(t)||d(e)===d(t)||e.isEqualNode(t)}(e,t))return;if(i(e,t),e.nodeName===t.nodeName)!function(e,t){var n,r,i,o,d;for(n=e.length;n--;)r=e[n],o=r.namespaceURI,d=r.localName,(i=t.getNamedItemNS(o,d))||e.removeNamedItemNS(o,d);for(n=t.length;n--;)r=t[n],o=r.namespaceURI,d=r.localName,(i=e.getNamedItemNS(o,d))?i.value!==r.value&&(i.value=r.value):(t.removeNamedItemNS(o,d),e.setNamedItemNS(r))}(e.attributes,t.attributes);else{for(var n=t.cloneNode();e.firstChild;)n.appendChild(e.firstChild);e.parentNode.replaceChild(n,e)}}else e.nodeValue!==t.nodeValue&&(e.nodeValue=t.nodeValue);else e.parentNode.replaceChild(t,u(e)),f(t)}function i(e,t){for(var n,i,d,a,l,s,c=e.firstChild,m=t.firstChild,p=0;c;)p++,i=o(n=c),c=c.nextSibling,i&&(s||(s={}),s[i]=n);for(c=e.firstChild;m;)p--,d=m,m=m.nextSibling,s&&(a=o(d))&&(l=s[a])?(delete s[a],l!==c?e.insertBefore(l,c):c=c.nextSibling,r(l,d)):c?(n=c,c=c.nextSibling,o(n)?(e.insertBefore(d,n),f(d)):r(n,d)):(e.appendChild(d),f(d));for(i in s)p--,e.removeChild(u(s[i]));for(;--p>=0;)e.removeChild(u(e.lastChild))}function o(e){if(e.nodeType===p){var t=e.getAttribute(n.KEY)||e.id;return t?c+t:void 0}}function d(e){return e.getAttribute(n.CHECKSUM)||NaN}function a(e){return null!=e.getAttribute(n.IGNORE)}function f(e){return l(e,"mount")}function u(e){return l(e,"dismount")}function l(e,t){if(o(e)){var n=document.createEvent("Event"),r={value:e};n.initEvent(t,!1,!1),Object.defineProperty(n,"target",r),Object.defineProperty(n,"srcElement",r),e.dispatchEvent(n)}for(var i=e.firstChild;i;)i=l(i,t).nextSibling;return e}n.KEY="data-key",n.IGNORE="data-ignore",n.CHECKSUM="data-checksum";var s=e(2),c="_set-dom-",m=c+"mounted",p=1,h=9,v=11;t.exports=n},{2:2}],2:[function(e,t){"use strict";function n(e,t){if(t===i){if(d)return c.innerHTML=e,c;var n=e.match(p);if(n){var o=n[2],a=n.index+n[1].length,u=a+o.length;e=e.slice(0,a)+e.slice(u),m.innerHTML=o}for(var l=r.parseFromString(e,f),s=l.body;m.firstChild;)s.appendChild(m.firstChild);return l.documentElement}return m.innerHTML=e,m.firstChild}var r=window.DOMParser&&new window.DOMParser,i="HTML",o=!1,d=!1,a="text/html",f="application/xhtml+xml";try{var u=r.parseFromString('<wbr class="A"/>',a).body.firstChild,l=document.createElement("div");if(l.appendChild(u),"A"!==l.firstChild.classList[0])throw new Error;o=!0}catch(e){}var s=document.implementation.createHTMLDocument(""),c=s.documentElement,m=s.body;try{c.innerHTML+="",d=!0}catch(e){r.parseFromString('<wbr class="A"/>',f);var p=/(<body[^>]*>)([\s\S]*)<\/body>/}t.exports=o?function(e,t){var o=r.parseFromString(e,a);return o.body?t===i?o.documentElement:o.body.firstChild:n(e,t)}:n},{}]},{},[1])(1)});

