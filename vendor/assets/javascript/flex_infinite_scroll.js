// Flex Infinite Scroll initialization

class FlexIS {
    constructor(objectName, config = {}) {
        this.targetObject = document.querySelector(objectName)
        this.config = config
        this.loading = false
        this.currentPage = this.config.startPage || 0
        this.nextPage = this.currentPage + 1
        
        this.config.url = this.config.url ||
                          this.targetObject.dataset.fisUrl
        
        this.config.loadMargin = this.config.loadMargin ||
                                 this.targetObject.dataset.fisloadMargin ||
                                 150
        
        this.config.eventTarget = prepareEventTarget(this)
        
        function prepareEventTarget(scrollObject) {
            var eventTarget = document.querySelector(scrollObject.config.eventTarget) ||
                              document.querySelector(scrollObject.targetObject.dataset.fisEventTarget) ||
                              scrollObject.targetObject
            return eventTarget.tagName === 'BODY' ? window : eventTarget
        }
    }
    
    init() {
        this.#getData();
        this.config.eventTarget.addEventListener('scroll', () => {
        	var scrollTop= this.config.eventTarget.scrollTop || this.config.eventTarget.scrollY;
        	var containerSize = this.config.eventTarget.innerHeight || this.targetObject.offsetHeight;
        	var scrollSize = this.#scrollHeight();
        	if (scrollTop + containerSize > scrollSize - this.config.loadMargin && this.nextPage !== 'last') {
                this.#getData()
        	};
        })
    }
    
    resetScroll() {
        this.currentPage = this.config.startPage || 0
        this.nextPage = this.currentPage + 1
        this.#getData();
    }
    
    // Private methods 
    
    
    #getData = (page = this.currentPage ) => {
        // Check for loading process and last page
        console.log(page)
        if (this.loading || page === 'last') return false;
        this.loading = true;
        
        var xhr = new XMLHttpRequest();
        var params = {page: parseInt(this.nextPage, 10)};
        xhr.open('GET', this.config.url + '?' + this.#urlParams(params));
        xhr.onload = () => {
          var json = JSON.parse(xhr.response)
          if (xhr.status === 200 && xhr.status < 300) {
            var div = document.createElement('div');
            div.innerHTML = json.data;
            while (div.children.length > 0) {
                this.targetObject.appendChild(div.children[0]);
            }
            
            this.currentPage = json.next_page ? json.current_page : 'last';
            this.nextPage = json.next_page;
            this.loading = false;
            if (this.#scrollNotApear()) {
              // check if on initial load not enough elements on screen
              this.#getData();
            }
          } else {
            this.loading = false;
          }
        };
        xhr.send();
    }
    
    #scrollHeight = () => {
        return this.targetObject.scrollHeight
    }
    
    #urlParams = (params) => {
        var encodedString = [];
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                encodedString.push(encodeURI(prop + '=' + params[prop]));
            }
        }
        return encodedString.join('&');
    }
    
    #scrollNotApear = () => {
      var containerSize = this.config.eventTarget.innerHeight || this.targetObject.offsetHeight;
      var scrollSize = this.#scrollHeight();
      return (scrollSize - containerSize - this.config.loadMargin <= 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var fisObjects = [...document.getElementsByClassName('fis-container')]
    fisObjects.forEach(object => {
        new FlexIS('#' + object.id).init()
    })
})
