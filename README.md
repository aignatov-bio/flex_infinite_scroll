# FlexInfiniteScroll
[![Gem Version](https://badge.fury.io/rb/flex_infinite_scroll.svg)](https://badge.fury.io/rb/flex_infinite_scroll)

Infinite scroll for Ruby on Rails applications on pure JavaScript.
### Features

* Virtual scroll.
* Custom response handling.
* Views and Models helpers.
* Perfect scrollbar support.


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
In controller add render method for the model which will be loaded:
```ruby
def list
    render json:  User.fis(params).render_html{ |el| content_tag(:div, el.name) }
end
```

Now add `fis_tag` to view, with same scoped data, path to `list` method and attach an event to window scroll:

```ruby
<%= fis_tag(User, { requestUrl: list_users_path, windowScroll: true }  do |el| %>
    <div><%= el.name %></div>
<% end %>
```

##### OR

If you don't want to use helpers, you can initialize it as JavaScript library:

```js
var scrollContainer = document.getElementById('example');
var fis = new flexIS(scrollContainer, {requestUrl: 'example_path'}).init();
```

##### OR

For more examples, you can run a demo project locally. Go to `example` folder.

Install gems:
```sh
bundle install
```

Initialize the database and seed it with test data:
```sh
rake db:create
rake db:migrate
rake db:seed
```

Run server:
```sh
rails s
```

Now you can access with browser - `http://localhost:3000`

### Model helper
```ruby
fis_data = User.fis(options)
```
Default options:
```ruby
{
    page: 1 # Which page select
    per_page: 20 # How much elements per page
}
```

##### Actions
###### `page`
Return current page for scoped data.
```ruby
fis_data.page 
```
###### `next_page`
Return next page for scoped data.
```ruby
fis_data.next_page
```
###### `per_page`
Return `per page` value for scoped data.
```ruby
fis_data.per_page
```
###### `total_pages`
Return amount of page value for initial data.
```ruby
fis_data.total_pages
```
###### `render_json`
Render data in JSON format
```ruby
fis_data.render_json
```
###### `render_html`
Render data in HTML format. Required HTML data block as a template for each element.
```ruby
fis_data.render_html{ |el|
    content_tag(:div, el.name)
}
```
### View helper
``` ruby
<%= fis_tag(data, fis_options, container_options) do |el| %>
    # HTML template for elements
<% end %>
```
`data` - scoped data. Must be same scope as in remote method.
`fis_options` - library options.
`container_options` - `content_tag` options, which will be applied to container.
### JS Library
```js
var fis = new flexIS(scrollContainer, options); 
```
`scrollContainer` - DOM object.
`options` - options in JSON format.

##### Actions

###### `init()`
Initialize scroll container.
```js
fis.init(); 
```

###### `resetScroll(page)` 
Reset scroll to the specific page and clear all data in the container. Default page - `1`.
```js
fis.resetScroll(); 
```

###### `appendChild(el)` 
Append DOM element to scroll container.
```js
fis.appendChild(el); 
```
`el` - DOM object.
##### Events

###### `FlexIS:beforeLoad`
Fires before next page request.

###### `FlexIS:afterLoad`
Fires after next page loaded.

### Options
`HTML` - available in HTML helper.
`JS` - available in JS library.
##### `customResponse` function(data, target) `JS`
Data processing after loading the next page. By default, data will be added as HTML.

##### `customResponseAttributes` object `JS`
Set custom response attribute.
**Default:**
```
{
    next_page: 'next_page', // Next page integer value, "null" - if no more pages. 
    data: 'data' // Field with HTML for render. Only for default response render.
    elements_left : 'elements_left' // Required for virtual scroll, how much elements left.
}
```

##### `eventTarget` string  `JS` `HTML`
Select different DOM elements for the scroll event. In query selector format `'#example'`.

##### `requestUrl` string **(required)**  `JS` `HTML`
URL for next page.

##### `loadMargin` integer  `JS` `HTML`
Bottom margin in pixels, when will start loading the next page.
**Default:** `150`

##### `startPage` integer  `JS` `HTML`
Start page for loading data.
**Default:** `1`

##### `requestType` string  `JS` `HTML`
Type of AJAX request. Default: `GET`

##### `customParams` function(params)  `JS`
Parameters that will be sent with next page request. 
**Default:** `{page: next_page}`

##### `windowScroll` boolean  `JS` `HTML`
Attach scroll event to `window` object.

##### `virtualScroll` boolean `HTML`
Enable virtual scroll.

##### `virtualScrollElementSize` integer `HTML`
Set element height. By default, it will be last element height on page.

##### `perfectScrollbarSupport` boolean  `JS` `HTML`
Enable perfect-scrollbar library support (perfect-scrollbar not included in gem).

##### `perfectScrollbarConfig` object  `JS`
Set perfect-scrollbar library config.

### Virtual scroll
Virtual scroll only supports fixed height elements. Virtual scroll can be enabled only in an HTML helper.
`virtualScroll` and `virtualScrollElementSize` must be defined.


License
----

MIT
