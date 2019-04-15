// Flex Infinite Scroll initialization

$.fn.extend({
  flexInfiniteScroll: function(config = {}) {
    // Config preparing
    var startPage = config.startPage || 1;
    var nextPage = startPage + 1;
    var dataUrl = config.url;
    var scrollContainer = this[0];
    var queryParams = config.queryParams;
    var dataProcess = config.dataProcess;
    var initialLoad = config.initialLoad;
    var loadMargin = config.loadMargin || 50;
    var beforeAction = config.beforeAction;
    var afterAction = config.afterAction;
    var targetContainer = config.targetContainer || scrollContainer ;
    var eventTarget;
    if (config.lastPage) nextPage = 'last';
    scrollContainer.dataset.fisNextPage = nextPage;
    scrollContainer.dataset.fisUrl = dataUrl;
    scrollContainer.dataset.fisLoading = 0;
    
    function getData(page = 1){
      // Check for loading process and last page
      if (scrollContainer.dataset.fisLoading === '1' || page == 'last') return false
      scrollContainer.dataset.fisLoading = 1;
      // before load action
      if (beforeAction) beforeAction;
      $.ajax({
        url: scrollContainer.dataset.fisUrl,
        // custom query params
        data: (queryParams || {page: page}),
        dataType: 'json',
        type: 'GET',
        success: function(json) {
          
          if (dataProcess){
            // custom user processor
            dataProcess(json,$(targetContainer));
          } else {
            // default data processor
            $(json.data).appendTo($(targetContainer));
          }
          scrollContainer.dataset.fisNextPage = json.next_page || 'last';
          scrollContainer.dataset.fisLoading = 0;
          if (scrollNotApear()) {
            // check if on initial load not enough elements on screen
            getData(scrollContainer.dataset.fisNextPage)
          }
          // after load action
          if (afterAction) afterAction;
        },
        error: function() {
          scrollContainer.dataset.fisLoading = 0;
        }
      });
    }
    
    // intial load
    if (initialLoad) {
      getData(startPage)
    } else if (scrollNotApear()) {
      // check if on initial load not enough elements on screen
      getData(scrollContainer.dataset.fisNextPage)
    }
    
    function scrollNotApear(){
    	var containerSize=$(scrollContainer).innerHeight();
    	var scrollSize=scrollContainer.scrollHeight;
      return (scrollSize - containerSize - (loadMargin * 1.1) < 0)
    }

    // check if body scroll
    eventTarget = (scrollContainer.localName == 'body' ? window : scrollContainer);

    $(eventTarget).on('scroll', () => {
    	var scrollTop=$(eventTarget).scrollTop();
    	var containerSize=$(scrollContainer).innerHeight();
    	var scrollSize=scrollContainer.scrollHeight;
    	if (scrollTop + containerSize > scrollSize - loadMargin && scrollContainer.dataset.fisNextPage != 'last'){
        getData(scrollContainer.dataset.fisNextPage);
    	};
    })
    
  }
})