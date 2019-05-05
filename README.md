# FlexInfiniteScroll
[![Gem Version](https://badge.fury.io/rb/flex_infinite_scroll.svg)](https://badge.fury.io/rb/flex_infinite_scroll)

Infinite scroll for Ruby on Rails applications on pure JavaScript. Also has Kaminari support for pagination.


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

    include FlexInfiniteScroll::ViewHelpers
    
    def index
        @users = User.order(:id).infinite_scroll(params[:page])
        respond_to do |format|
            format.json do
                render json: fis_next_page(@users,'users/user_partial.html.erb')
            end
            format.html do
            end
        end
    end
    
end
```

User view:
```sh
# views/users/index.html.erb
<%= fis_init_list(@users, 'users/user_partial', url: users_path) %>
```

User partial:
```sh
# views/users/_user_partial.html.erb
<div class="user-container">
    <div class="user-name"><%= fis_object.user_name %></div>
</div>
```

### Example with Kaminari
For this example we will use same model and user partial. But now we will use Kaminari pagination gem.
User controller:
```sh
#controllers/users_controller.rb
class UsersController < ApplicationController

    include FlexInfiniteScroll::ViewHelpers
    
    def index
        @users = User.page(params[:page] || 1)
        respond_to do |format|
            format.json do
                render json: fis_next_page(@users,'users/user_partial.html.erb', kaminari: true)
            end
            format.html do
            end
        end
    end
    
end
```

User view:
```sh
# views/users/index.html.erb
<%= fis_init_list(@users, 'users/user_partial', url: users_path, kaminari: true) %>
```

#### Configuration
Pagination for model
```sh
self.infinite_scroll(page = 1, page_size = (ENV['FIS_PAGE_SIZE'] || 20))
```
Configuration that you add to ```fis_init_list``` will be copy to JS library ```flexInfiniteScroll```. So you can use JS library separetly with you favorite pagination gem. 

Configuration for JS library and :

|Parameter|Type|Default|JS|Description|
|---------|----|-------|--|-----------|
|afterAction|function()|null|```True```|Function that run before loading next page.|
|beforeAction|function()|null|```True```|Function that run after loading next page.|
|container_class|string|null|```False```| Add custom classes to container|
|dataProcess|function(data,target)|null|```True```|Data post process after loading next page - 
|url|string|null|```True```|**(required)** Next page data URL.|
|initialLoad|boolean|null|```True```|Load first page with Ajax.|
|kaminari|boolean|false|```False```|Enable Kaminari support.|
|loadMargin|integer|150|```True```|Bottom margin in pixels, when will start loading next page.|
|lastPage|boolean|false|```True```|Set current page as last page|
|scrollContainer|string|body|```False```| Select target for scroll event|
|startPage|integer|1|```True```|Start page for loading data|
|targetContainer|string|null|```True```|Select container to append next page data|
|queryParams|json|{page: page}|```True```|Params that will send to next page request.|


License
----

MIT
