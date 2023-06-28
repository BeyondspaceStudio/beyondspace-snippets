loadjs=window.loadjs || function(){var h=function(){},o={},c={},f={};function u(e,n){if(e){var t=f[e];if(c[e]=n,t)for(;t.length;)t[0](e,n),t.splice(0,1)}}function l(e,n){e.call&&(e={success:e}),n.length?(e.error||h)(n):(e.success||h)(e)}function p(t,r,i,s){var o,e,u,n=document,c=i.async,f=(i.numRetries||0)+1,l=i.before||h,a=t.replace(/[\?|#].*$/,""),d=t.replace(/^(css|img|module|nomodule)!/,"");if(s=s||0,/(^css!|\.css$)/.test(a))(u=n.createElement("link")).rel="stylesheet",u.href=d,(o="hideFocus"in u)&&u.relList&&(o=0,u.rel="preload",u.as="style");else if(/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(a))(u=n.createElement("img")).src=d;else if((u=n.createElement("script")).src=d,u.async=void 0===c||c,e="noModule"in u,/^module!/.test(a)){if(!e)return r(t,"l");u.type="module"}else if(/^nomodule!/.test(a)&&e)return r(t,"l");!(u.onload=u.onerror=u.onbeforeload=function(e){var n=e.type[0];if(o)try{u.sheet.cssText.length||(n="e")}catch(e){18!=e.code&&(n="e")}if("e"==n){if((s+=1)<f)return p(t,r,i,s)}else if("preload"==u.rel&&"style"==u.as)return u.rel="stylesheet";r(t,n,e.defaultPrevented)})!==l(t,u)&&n.head.appendChild(u)}function t(e,n,t){var r,i;if(n&&n.trim&&(r=n),i=(r?t:n)||{},r){if(r in o)throw"LoadJS";o[r]=!0}function s(n,t){!function(e,r,n){var t,i,s=(e=e.push?e:[e]).length,o=s,u=[];for(t=function(e,n,t){if("e"==n&&u.push(e),"b"==n){if(!t)return;u.push(e)}--s||r(u)},i=0;i<o;i++)p(e[i],t,n)}(e,function(e){l(i,e),n&&l({success:n,error:t},e),u(r,e)},i)}if(i.returnPromise)return new Promise(s);s()}return t.ready=function(e,n){return function(e,t){e=e.push?e:[e];var n,r,i,s=[],o=e.length,u=o;for(n=function(e,n){n.length&&s.push(e),--u||t(s)};o--;)r=e[o],(i=c[r])?n(r,i):(f[r]=f[r]||[]).push(n)}(e,function(e){l(n,e)}),t},t.done=function(e){u(e,[])},t.reset=function(){o={},c={},f={}},t.isDefined=function(e){return e in o},t}();

(function docReady(fn) {
    const currentscript = document.currentScript;
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn.bind(this, currentscript), 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn.bind(this, currentscript));
    }
})(function(currentscript) {
    const debugMode = new URLSearchParams(window.location.search).get('beyondspace-debug') !== null;

    const defaultSettings = {
        style: 'github'
    }

    // Expect data-widget-config attribute
    const scriptOption = JSON.parse(currentscript.dataset.widgetConfig || "{}");

    const options = {
        ...defaultSettings,
        ...scriptOption
    }

    const deps = [{
        path: 'https://cdn.jsdelivr.net/combine/npm/highlightjs-badge@0.1.9/highlightjs/highlight.pack.min.js,npm/highlightjs-badge@0.1.9',
        depsCheck: () => window.hljs && window.highlightJsBadge,
    }, {
        path: 'https://cdn.jsdelivr.net/gh/csuwildcat/SelectorListener/selector-listeners.min.js',
        depsCheck: () => document?.SelectorListener,
    }, {
        path: `https://cdn.jsdelivr.net/npm/highlightjs-badge@0.1.9/highlightjs/styles/${options.style}.min.css`,
    }];

    const loadjsDeps = [];
    // Iterate over deps and load them if depsCheck is false
    deps.forEach(dep => {
        if (!dep.depsCheck || !dep.depsCheck()) {
            loadjsDeps.push(dep.path);
        }
    });
    loadjs([
        ...loadjsDeps,
    ], 'beyondspace-highlight-block-deps');

    // Check against the current style tag via its id and append the style to document
    const styleTag = document.getElementById('beyondspace-highlight-block-style');
    if (!styleTag) {
        const style = document.createElement('style');
        style.id = 'beyondspace-highlight-block-style';
        style.innerHTML = `
        .code-badge-copy-icon.highlight-block-check {
            background: url(https://api.iconify.design/carbon/checkmark.svg?color=white&width=36) no-repeat center center / contain;
            width: 25px;
            height: 25px;
            display: inline-block;
            padding: 0;
        }
        .code-badge-copy-icon.highlight-block-copy {
            background: url('https://api.iconify.design/carbon/copy.svg?color=white&width=36') no-repeat center center / contain;
            width: 25px;
            height: 25px;
            display: inline-block;
            padding: 0;
        }
        code.hljs {
            padding: 1em;
        }
        .source-code.code-badge-pre {
            margin: 0;
        }
        `
        document.head.appendChild(style);
    }

    loadjs.ready('beyondspace-highlight-block-deps', function() {
        function enableHighlight(selector) {
            var pres = document.querySelectorAll(selector || "pre.source-code:not(.raw-source-code)");
            for (var i = 0; i < pres.length; i++) {
                const codeElement = document.createElement('code');
                codeElement.style.whiteSpace = 'pre-wrap';

                codeElement.textContent = pres[i].textContent;
                pres[i].innerHTML = '';
                pres[i].appendChild(codeElement);
                hljs.highlightBlock(pres[i].querySelector('code'));

                pres[i].classList.remove('.raw-source-code');
            }
            
            // add HighlightJS-badge (options are optional)
            var options = {   // optional
                // CSS class(es) used to render the copy icon.
            copyIconClass: "highlight-block-copy",
            // CSS class(es) used to render the done icon.
            checkIconClass: "highlight-block-check"
            };
            window.highlightJsBadge(options);
        }
        enableHighlight();
        // Listen to new .raw-source-code
        document.addSelectorListener('pre.source-code.raw-source-code', (e) => {
            enableHighlight('pre.source-code.raw-source-code');
        })
    });
});

