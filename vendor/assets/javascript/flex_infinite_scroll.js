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
        },
        virtualScroll: 'Enable virtual scroll',
        virtualScrollElementSize: 'Element size for virtual scroll',
        perfectScrollbarSupport: 'Enable perfect-scrollbar support'
        perfectScrollbarConfig: 'Config for perfect-scrollbar'
    }
*/

'use strict';

class flexIS {
    constructor(targetObject, config = {}) {
        this.targetObject = (typeof(targetObject) === 'object' ? targetObject : document.querySelector(targetObject));
        this.config = {...config, ...this.targetObject.dataset};
        this.loading = false;
        this.nextPage = this.config.startPage || 1;
        this.totalElements;

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

        if (this.config.perfectScrollbarSupport) {
            let PSConfig = this.config.perfectScrollbarConfig || {}
            PSConfig.minScrollbarLength = PSConfig.minScrollbarLength || 40
            this.perfectScrollbar = new PerfectScrollbar(
                this.targetObject,
                PSConfig
            )
        }
    }

    // Init infinite scroll
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

    // Reset scroll to specific page
    resetScroll(page) {
        this.targetObject.innerHTML = '';
        this.nextPage =  page || this.config.startPage || 1;
        this.#getData();
        return this;
    }

    // Append element to container
    appendChild(el) {
        this.#appendElementToContainer(el);
        return this;
    }

    // Private methods

    // Run data request for next page
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
            if (this.config.virtualScroll) {
                this.elementsLeft = json[this.config.customResponseAttributes.elements_left];
                this.#virtualScroll().update();
            }
            if (this.#scrollHitBottom()) this.#getData();
          }

          this.targetObject.dispatchEvent(afterLoadEvent);

        }
        xhr.send();
    }

    // Full scroll height
    #scrollHeight = () => {
        return this.targetObject.scrollHeight;
    }

    // Top scroll position
    #scrollTop = () => {
        return this.config.eventTarget.scrollTop || this.config.eventTarget.scrollY || 0;
    }

    // Get container size
    #containerSize = () => {
        return this.config.eventTarget.innerHeight || this.targetObject.offsetHeight;
    }

    // Container position
    #containerPosition = () => {
        return this.#scrollTop() + this.#containerSize() + this.config.loadMargin
    }

    // Add custom params to request
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

    // Response handling
    #customResponse = (json) => {
        var customResponse = this.config.customResponse;
        var data = json[this.config.customResponseAttributes.data];
        var div;

        delete json[this.config.customResponseAttributes.data]

        if (data.constructor === Array) {
            data.forEach((el) => {
                var htmlEl
                if (typeof customResponse === "function") {
                    htmlEl = customResponse(el, json);
                } else {
                    htmlEl = el;
                }
                this.#appendElementToContainer(htmlEl)
            })
        } else if (data.constructor === String) {
            div = document.createElement('div');
            div.innerHTML = data;
            while (div.children.length > 0) {
                this.#appendElementToContainer(div.children[0])
            }
        }

        this.#hideInvisibleContent();

        if (this.perfectScrollbar) {
            this.perfectScrollbar.update();
        }
    }

    #appendElementToContainer = (el) => {
        if (this.#virtualScroll().baloon()) {
            this.targetObject.insertBefore(el, this.#virtualScroll().baloon());
        } else {
            this.targetObject.appendChild(el);
        }
        this.elementHeight = el.offsetHeight;
    }

    // Hide invisible content, when leaving active zone
    #hideInvisibleContent = () => {
        var elems = this.targetObject.children;
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            let elementTopPosition = elems[i].offsetTop + elems[i].offsetHeight - this.#scrollTop();
            let elementBottomPosition = elems[i].offsetTop - elems[i].offsetHeight - this.#scrollTop() - this.#containerSize();

            if (elem.className.includes('ps__rail-x', 'ps__rail-y')) continue;

            if (elementTopPosition <= 0 || elementBottomPosition >= 0) {
                if (elem.style.visibility === 'hidden') continue;
                elem.style.visibility = 'hidden';
            } else {
                if (elem.style.visibility === '') continue;
                elem.style.visibility = '';
            }
        }
    }

    #virtualScroll = () => {
        // Find baloon
        var baloon = this.targetObject.getElementsByClassName('fis-baloon')[0];

        // Create new baloon
        var createBaloon = () => {
            baloon = document.createElement('div');
            baloon.className = 'fis-baloon';
            this.targetObject.appendChild(baloon);
            return baloon;
        }

        // Check if baloon exist and return it
        var baloonAdded = () => {
            if (baloon) {
                return baloon;
            }
            return false
        }

        // Update baloon size
        var updateScroll = () => {
            var elementHeight = this.config.virtualScrollElementSize || this.elementHeight;
            if (!baloonAdded()) {
                baloon = createBaloon();
            }
            if (this.elementsLeft > 0) {
                baloon.style.height = (elementHeight * this.elementsLeft) + 'px';
            } else {
                // Remove baloon, if no more elements to load.
                baloon.remove();
            }
        }

        return {
            update: () => {
                updateScroll()
            },
            baloon: () => {
                return baloonAdded();
            }
        }
    }

    // Update response attributes
    #customResponseAttributesSet = () => {
        var attr = this.config.customResponseAttributes || {};
        attr.next_page = attr.next_page || 'next_page';
        attr.data = attr.data || 'data';
        attr.elements_left = attr.elements_left || 'elements_left';
        this.config.customResponseAttributes = attr
    }

    // Generate url with params
    #requestUrl = (params) => {
        var encodedString = [];
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                encodedString.push(encodeURI(prop + '=' + params[prop]));
            }
        }
        return this.config.requestUrl + '?' + encodedString.join('&');
    }

    // Check when load next page
    #scrollHitBottom = () => {
        var hitBottom;
        if (this.#virtualScroll().baloon()) {
            hitBottom = this.#containerPosition() > this.#virtualScroll().baloon().offsetTop;
        } else {
            hitBottom = this.#scrollHeight() - this.#containerPosition() <= 0;
        }
        return hitBottom;
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
