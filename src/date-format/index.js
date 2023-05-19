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
    const defaultSettings = {
        outputFormat: 'DD/MM/YYYY',
        defaultLocale: 'en',
    }
    // Expect data-widget-config attribute
    const scriptOption = JSON.parse(currentscript.dataset.widgetConfig || "{}");

    const options = {
        ...defaultSettings,
        ...scriptOption
    }

    function getLocaleFromUrl() {
        // Locales from https://cdn.jsdelivr.net/npm/dayjs@1/locale.json
        const defaultLocale = options.defaultLocale;
        const segments = location.pathname.split('/');
        let locale = segments[1] || defaultLocale;
    
        const validLocales = [
            "af",
            "am",
            "ar-dz",
            "ar-iq",
            "ar-kw",
            "ar-ly",
            "ar-ma",
            "ar-sa",
            "ar-tn",
            "ar",
            "az",
            "be",
            "bg",
            "bi",
            "bm",
            "bn-bd",
            "bn",
            "bo",
            "br",
            "bs",
            "ca",
            "cs",
            "cv",
            "cy",
            "da",
            "de-at",
            "de-ch",
            "de",
            "dv",
            "el",
            "en-au",
            "en-ca",
            "en-gb",
            "en-ie",
            "en-il",
            "en-in",
            "en-nz",
            "en-sg",
            "en-tt",
            "en",
            "eo",
            "es-do",
            "es",
            "et",
            "eu",
            "fa",
            "fi",
            "fo",
            "fr-ca",
            "fr-ch",
            "fr",
            "fy",
            "ga",
            "gd",
            "gl",
            "gom-latn",
            "gu",
            "he",
            "hi",
            "hr",
            "ht",
            "hu",
            "hy-am",
            "id",
            "is",
            "it-ch",
            "it",
            "ja",
            "jv",
            "ka",
            "kk",
            "km",
            "kn",
            "ko",
            "ku",
            "ky",
            "lb",
            "lo",
            "lt",
            "lv",
            "me",
            "mi",
            "mk",
            "ml",
            "mn",
            "mr",
            "ms-my",
            "ms",
            "mt",
            "my",
            "nb",
            "ne",
            "nl-be",
            "nl",
            "nn",
            "oc-lnc",
            "pa-in",
            "pl",
            "pt-br",
            "pt",
            "rn",
            "ro",
            "ru",
            "rw",
            "sd",
            "se",
            "si",
            "sk",
            "sl",
            "sq",
            "sr-cyrl",
            "sr",
            "ss",
            "sv-fi",
            "sv",
            "sw",
            "ta",
            "te",
            "tet",
            "tg",
            "th",
            "tk",
            "tl-ph",
            "tlh",
            "tr",
            "tzl",
            "tzm-latn",
            "tzm",
            "ug-cn",
            "uk",
            "ur",
            "uz-latn",
            "uz",
            "vi",
            "x-pseudo",
            "yo",
            "zh-cn",
            "zh-hk",
            "zh-tw",
            "zh",
            "es-mx",
            "es-pr",
            "es-us"
        ];
    
        if (!validLocales.includes(locale)) {
            locale = defaultLocale;
        }
    
        return locale;
    }
    
    const formatDate = (date, format = options.outputFormat) => {
        const locale = getLocaleFromUrl();
        return dayjs(date).tz(Static.SQUARESPACE_CONTEXT.website.timeZone).locale(locale).format(format);
    }
    const parseUrl = window.Beyondspace?.snapshotUtils?.parseUrl || function(url) {
        return url;
    }
    
    function handleListener(selectorItem, event) {
        try {
            const item = event.target;
            const blogItem = item.closest(selectorItem.parent);
            // Set target style using variables
            item.style.opacity = 'var(--pubdate-opacity, 0)';
            
            let linkElement = null;
            if (!selectorItem.isBlogPost) {
                linkElement = blogItem.querySelector(selectorItem.link);
            } else {
                linkElement = document.querySelector(selectorItem.link);
            }
            
            const href = linkElement.href;
    
            const currentUrl = new URL(href);
            const urlSearchParams = new URLSearchParams(currentUrl.search);
            urlSearchParams.set('format', 'json');
            const modifiedUrl = new URL(currentUrl.href.split('?')[0] + '?' + urlSearchParams.toString());
    
            let jsonFormat = modifiedUrl.href;
            // For snapshot fix
            fetch(jsonFormat)
                .then(res=>res.json())
                .then(res=>{
                    item.innerHTML = formatDate(new Date(res.item.publishOn)); 
    
                    blogItem.style.setProperty('--pubdate-opacity', '1');
                    blogItem.classList.add('is-formatted-date');
                });
        } catch (error) {
            console.error(error);
        }
    }
    
    const dateSelectors = [{
        item: `body:not(.sqs-seven-one)[class*=collection-type-blog].view-item .blog-item-title .dt-published`,
        parent: `.blog-item-title`,
        link: `link[rel="canonical"]`,
        isBlogPost: true,
        desc: 'Blog Post Title 7.0'
    },{
        item: `.blog-list-item .dt-published`,
        parent: `.blog-list-item`,
        link: `.entry-header a[href]`,
        desc: `Blog Post Related 7.0`
    },{
        item: `.blog-item-pagination .dt-published`,
        parent: `.blog-item-pagination`,
        link: `.blog-item-pagination-link`,
        desc: `Blog Post Pagination 7.0`
    },{
        item: `body:not(.sqs-seven-one)[class*=collection-type-blog].view-list article time[pubdate]`,
        parent: `article`,
        link: `.entry-header a[href]`,
        desc: `Blog List Items 7.0`
    },{
        item: `.summary-metadata-item--date`,
        parent: `.summary-item`,
        link: `.summary-title a[href]`,
        desc: `Summary Block`
    },{
        item: `.sqs-seven-one[class*=collection-type-blog].view-list .blog-item time[pubdate]`,
        parent: `.blog-item`,
        link: `.blog-title a[href]`,
        desc: `Blog List Items 7.1`
    },{
        item: `.sqs-seven-one[class*=collection-type-blog].view-item article time[pubdate]`,
        parent: `article`,
        link: `link[rel="canonical"]`,
        isBlogPost: true,
        desc: `Blog Post Title 7.1`
    }]
    
    if (document.addSelectorListener) {
        dateSelectors.forEach(selector => {
            // Add additional param to handleListener, make it accept handleListener(event, selector)
            document.addSelectorListener(selector.item, handleListener.bind(null, selector));
        });
    } else {
        setTimeout(() => {
            dateSelectors.forEach(selector => {
                // Add additional param to handleListener, make it accept handleListener(event, selector)
                document.addSelectorListener(selector.item, handleListener.bind(null, selector));
            });
        }, 1500);
    }
});

