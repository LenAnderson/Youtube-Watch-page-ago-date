// ==UserScript==
// @name         YouTube - Watch page ago date
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/YouTube-watch-page-ago-date/raw/master/youtube_watch_page_ago_date.user.js
// @version      1.0
// @author       LenAnderson
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const periods = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'decade'];
    const lengths = [60, 60, 24, 7, 4.35, 12, 10];
    const ago = (date)=>{
        const now = new Date().getTime();
        let delta = (now - date)/1000;
        let i = 0;
        for (i; delta >= lengths[i] && i < lengths.length; i++) {
            delta /= lengths[i];
        }
        delta = Math.round(delta);

        if (i == 0) {
            return 'just now';
        }
        return `${delta} ${periods[i]}${i==1?'':'s'} ago`;
    };

    const replaceDate = ()=>{
        const element = document.querySelector('#date > yt-formatted-string');
        if (element && (!element.closest('#date').classList.contains('ago') || element.querySelector('span')) && element.textContent.length > 0) {
            const span = element.querySelector('span');
            const text = (span||element).textContent.trim();
            element.closest('#date').classList.add('ago');
            const date = new Date(text.replace('Published on ', '')).getTime();
            element.title = text;
            element.textContent = `Published ${ago(date)}`;
        }
    }
    replaceDate();

    const mo = new MutationObserver(muts=>{
        if (location.href.search(/youtube.com\/watch/i) > -1) {
            replaceDate();
        }
    });
    mo.observe(document.body, {childList: true, subtree: true});
})();
