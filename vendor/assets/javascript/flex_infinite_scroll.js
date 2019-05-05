// Flex Infinite Scroll initialization


function flexInfiniteScroll(object_id,config = {}) {
    // Config preparing
    var startPage = config.startPage || 1;
    var nextPage = startPage + 1;
    var dataUrl = config.url;
    var scrollContainer = (object_id == 'body' ? document.body : document.getElementById(object_id));
    var queryParams = config.queryParams;
    var dataProcess = config.dataProcess;
    var initialLoad = config.initialLoad;
    var loadMargin = config.loadMargin || 150;
    var beforeAction = config.beforeAction;
    var afterAction = config.afterAction;
    var targetContainer= config.targetContainer || scrollContainer ;
    var eventTarget = (object_id == 'body' ? window : scrollContainer);
    if (config.lastPage) nextPage = 'last';
    scrollContainer.dataset.fisNextPage = nextPage;
    scrollContainer.dataset.fisUrl = dataUrl;
    scrollContainer.dataset.fisLoading = 0;
    
    function getScrollHeight(){
      if (object_id == 'body'){
        return document.documentElement.scrollHeight;
      } else {
        return eventTarget.scrollHeight;
      }
      
    }

    function urlParams(object) {
      var encodedString = '';
      for (var prop in object) {
          if (object.hasOwnProperty(prop)) {
              if (encodedString.length > 0) {
                  encodedString += '&';
              }
              encodedString += encodeURI(prop + '=' + object[prop]);
          }
      }
      return encodedString;
    }
    
    function getData(page = 1){
      // Check for loading process and last page
      if (scrollContainer.dataset.fisLoading === '1' || page == 'last') return false;
      scrollContainer.dataset.fisLoading = 1;
      // before load action
      if (beforeAction) {
        if (typeof(beforeAction) == 'function') {
          beforeAction();
        }else if (typeof(beforeAction) == 'string') {
          eval(beforeAction);
        }
      }
      var xhr = new XMLHttpRequest();
      var params = (queryParams || {page: page});
      xhr.open('GET', scrollContainer.dataset.fisUrl + '?' + urlParams(params));
      xhr.onload = function() {
        var json = JSON.parse(xhr.response)
        if (xhr.status === 200) {
          if (dataProcess){
            // custom user processor
            dataProcess(json,targetContainer);
          } else {
            // default data processor
            var div = document.createElement('div');
            div.innerHTML = json.data;
            while (div.children.length > 0) {
              document.getElementById(targetContainer).appendChild(div.children[0]);
            }
          }
          scrollContainer.dataset.fisNextPage = json.next_page || 'last';
          scrollContainer.dataset.fisLoading = 0;
          if (scrollNotApear()) {
            // check if on initial load not enough elements on screen
            getData(scrollContainer.dataset.fisNextPage);
          }
          // after load action
          if (afterAction) {
            if (typeof(afterAction) == 'function') {
              afterAction();
            }else if (typeof(afterAction) == 'string') {
              eval(afterAction)
            }
          }   
        } else {
          scrollContainer.dataset.fisLoading = 0;
        }
      };
      xhr.send();
    }
    
    // intial load
    if (initialLoad) {
      getData(startPage);
    } else if (scrollNotApear()) {
      // check if on initial load not enough elements on screen
      getData(scrollContainer.dataset.fisNextPage);
    }
    
    // check if body scroll
    
    function scrollNotApear(){
      var containerSize=(object_id == 'body' ?  eventTarget.innerHeight : eventTarget.offsetHeight);
    	var scrollSize=getScrollHeight();
      return (scrollSize - containerSize - loadMargin <= 0);
    }

    eventTarget.addEventListener('scroll', function() {
    	var scrollTop= (object_id == 'body' ?  eventTarget.scrollY : eventTarget.scrollTop);
    	var containerSize=(object_id == 'body' ?  eventTarget.innerHeight : eventTarget.offsetHeight);
    	var scrollSize=getScrollHeight();
    	if (scrollTop + containerSize > scrollSize - loadMargin && scrollContainer.dataset.fisNextPage != 'last'){
        getData(scrollContainer.dataset.fisNextPage);
    	};
    })
    
    
    
}
