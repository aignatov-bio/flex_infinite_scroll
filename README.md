# FlexInfiniteScroll
[![Gem Version](https://badge.fury.io/rb/flex_infinite_scroll.svg)](https://badge.fury.io/rb/flex_infinite_scroll)

Simple infinite scroll gem based on jQuery. Have JS part and ruby part, that you can use separetly.


### Installation



Add gem to GemFile

```sh
gem 'flex_infinite_scroll'
```

Add JS library to application.js

```sh
//= require flex_infinite_scroll
```

### Example

Simple example for User model.

User model:
```sh
# models/user.rb
class User < ApplicationRecord
    extend FlexInfiniteScroll
end
```

User controller:
```sh
#controllers/users_controller.rb
class UsersController < ApplicationController
    def index
    end
    
    def get_users
        render json: User.order(:id).infinite_scroll(params[:page])
    end
end
```

User view:
```sh
# views/users/index.html.erb
<div class="data-container"></div>

<script>
    $('body').flexInfiniteScroll({
        url: 'users/get_users',
        targetContainer: '.data-container',
        initialLoad: true
    })
</script>
```
#### Configuration
Pagination for model
```sh
self.infinite_scroll(page = 1, page_size = (ENV['FIS_PAGE_SIZE'] || 20))
```
Configuration for JS library:

|Parameter|Type|Default|Description|
|---------|----|-------|-----------|
|afterAction|function()|null|Function that run before loading next page.|
|beforeAction|function()|null|Function that run after loading next page.|
|dataProcess|function(data,target)|null| Data post process after loading next page - 
|url|string|null|**(required)** Next page data URL.|
|initialLoad|boolean|null|Load first page with Ajax.|
|loadMargin|integer|50|Bottom margin in pixels, when will start loading next page.|
|lastPage|boolean|false|Set current page as last page|
|startPage|integer|1|Start page for loading data|
|targetContainer|string|null| Select container to append next page data|
|queryParams|json|{page: page}|Params that will send to next page request. 

License
----

MIT