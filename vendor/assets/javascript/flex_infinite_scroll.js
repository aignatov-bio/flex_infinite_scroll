// Flex Infinite Scroll initialization

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

        function prepareEventTarget(object) {
            var eventTarget = document.querySelector(object.config.eventTarget) || object.targetObject;
            if (object.config.windowScroll) {
                return window
            } else {
                return eventTarget
            }
        }
    }

    init() {
        this.#getData();
        this.config.eventTarget.addEventListener('scroll', () => {
        	if (this.#scrollHitBottom() && this.nextPage) {
                this.#getData();
        	};
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

        this.targetObject.dispatchEvent(beforeLoadEvent)
        xhr.open('GET', this.#requestUrl(params));
        xhr.onload = () => {
          var json = JSON.parse(xhr.response);

          this.loading = false;

          if (xhr.status === 200) {
            this.#customResponse(json)
            this.nextPage = json.next_page;
            if (this.#scrollHitBottom()) this.#getData();
          }

          this.targetObject.dispatchEvent(afterLoadEvent)

        }
        xhr.send();
    }

    #scrollHeight = () => {
        return this.targetObject.scrollHeight;
    }

    #scrollTop = () => {
        return this.config.eventTarget.scrollTop || this.config.eventTarget.scrollY;
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
            div.innerHTML = json.data;
            while (div.children.length > 0) {
                this.targetObject.appendChild(div.children[0]);
            }
        }

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
        }
    })
})

document.addEventListener('turbolinks:load', () => {
    var fisObjects = [...document.getElementsByClassName('fis-turbolinks-container')];
    fisObjects.forEach(object => {
        object.data = {
            flexIS: new flexIS(object).init()
        }
    })
})
