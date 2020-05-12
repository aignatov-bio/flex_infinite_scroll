// Flex Infinite Scroll initialization

/*
    config = {
        customResponse: function(target, data) {
            'Data processing after loading next page. By default data will be added as HTML.'
        },
        eventTarget: 'Select different DOM element for scroll event',
        requestUrl: 'URL for next page.',
        loadMargin: 'Bottom margin in pixels, when will start loading next page. Default: 150',
        startPage: 'Start page for loading data. Default: 1',
        requestType: 'Type of AJAX request. Default: GET',
        customParams: function(params) {
            Parameters that will be sent with next page request. Default: {page: next_page}
            return params
        },
        windowScroll: Attach scroll event to window object,
        customResponseAttributes: {
            next_page: 'next_page',
            data: 'data'
        }
    }
*/

'use strict';

class flexIS {
    constructor(targetObject, config = {}) {
        this.targetObject = (typeof(targetObject) === 'object' ? targetObject : document.querySelector(targetObject));
        this.config = {...config, ...this.targetObject.dataset};
        this.loading = false;
        this.nextPage = this.config.startPage || 1;

        this.config.requestType = this.config.requestType || 'GET';
        this.config.loadMargin = this.config.loadMargin || 150;
        this.config.eventTarget = prepareEventTarget(this);
        this.#customResponseAttributesSet();

        function prepareEventTarget(object) {
            var eventTarget = document.querySelector(object.config.eventTarget) || object.targetObject;
            if (object.config.windowScroll) {
                return window;
            } else {
                return eventTarget;
            }
        }
    }

    init() {
        this.#getData();
        this.config.eventTarget.addEventListener('scroll', () => {
        	if (this.#scrollHitBottom() && this.nextPage) {
                this.#getData();
        	};
            this.#hideInvisibleContent();
        });
        return this;
    }

    resetScroll(page) {
        this.targetObject.innerHTML = '';
        this.nextPage =  page || this.config.startPage || 1;
        this.#getData();
        return this;
    }

    // Private methods

    #getData = (page = this.nextPage ) => {
        var xhr = new XMLHttpRequest();
        var params;
        const beforeLoadEvent = new CustomEvent('FlexIS:beforeLoad');
        const afterLoadEvent = new CustomEvent('FlexIS:afterLoad');

        if (!page || this.loading) return false;

        this.loading = true;

        params = this.#customParams({page: parseInt(page, 10)});

        this.targetObject.dispatchEvent(beforeLoadEvent);
        xhr.open('GET', this.#requestUrl(params));
        xhr.onload = () => {
          var json = JSON.parse(xhr.response);

          this.loading = false;

          if (xhr.status === 200) {
            this.#customResponse(json);
            this.nextPage = json[this.config.customResponseAttributes.next_page];
            if (this.#scrollHitBottom()) this.#getData();
          }

          this.targetObject.dispatchEvent(afterLoadEvent);

        }
        xhr.send();
    }

    #scrollHeight = () => {
        return this.targetObject.scrollHeight;
    }

    #scrollTop = () => {
        return this.config.eventTarget.scrollTop || this.config.eventTarget.scrollY || 0;
    }

    #containerSize = () => {
        return this.config.eventTarget.innerHeight || this.targetObject.offsetHeight;
    }

    #customParams = (params) => {
        var customParams = this.config.customParams;
        if (customParams) {
            if (typeof customParams === "function") {
                return customParams(params);
            } else if (typeof customParams === "object") {
                return {...customParams, ...params};
            } else if (typeof customParams === "string") {
                return {...JSON.parse(customParams), ...params};
            }
        }
        return params;
    }

    #customResponse = (json) => {
        var customResponse = this.config.customResponse;
        var div;
        if (typeof customResponse === "function") {
            customResponse(this.targetObject, json);
        } else {
            div = document.createElement('div');
            div.innerHTML = json[this.config.customResponseAttributes.data];
            while (div.children.length > 0) {
                this.targetObject.appendChild(div.children[0]);
            }
        }

        this.#hideInvisibleContent();
    }

    #hideInvisibleContent = () => {
        var elems = this.targetObject.children;
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            let elementTopPosition = elems[i].offsetTop + elems[i].offsetHeight - this.#scrollTop();
            let elementBottomPosition = elems[i].offsetTop - elems[i].offsetHeight - this.#scrollTop() - this.#containerSize();

            if (elementTopPosition <= 0 || elementBottomPosition >= 0) {
                if (elem.style.visibility === 'hidden') continue;
                elem.style.visibility = 'hidden';
            } else {
                if (elem.style.visibility === '') continue;
                elem.style.visibility = '';
            }
        }
    }

    #customResponseAttributesSet = () => {
        var attr = this.config.customResponseAttributes || {};
        attr.next_page = attr.next_page || 'next_page';
        attr.data = attr.data || 'data';
        this.config.customResponseAttributes = attr
    }

    #requestUrl = (params) => {
        var encodedString = [];
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                encodedString.push(encodeURI(prop + '=' + params[prop]));
            }
        }
        return this.config.requestUrl + '?' + encodedString.join('&');
    }

    #scrollHitBottom = () => {
        return (this.#scrollHeight() - this.#scrollTop()  - this.#containerSize() - this.config.loadMargin <= 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var fisObjects = [...document.getElementsByClassName('fis-container')];
    fisObjects.forEach(object => {
        object.data = {
            flexIS: new flexIS(object).init()
        };
    })
})

document.addEventListener('turbolinks:load', () => {
    var fisObjects = [...document.getElementsByClassName('fis-turbolinks-container')];
    fisObjects.forEach(object => {
        object.data = {
            flexIS: new flexIS(object).init()
        };
    })
})
