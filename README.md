# FlexInfiniteScroll
[![Gem Version](https://badge.fury.io/rb/flex_infinite_scroll.svg)](https://badge.fury.io/rb/flex_infinite_scroll)

Infinite scroll for Ruby on Rails applications on pure JavaScript.


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

Simply add `fis-container` class and `data-request-url="<%= example_path %>"` attribute to container:

```html
<div class="fis-container" data-request-url="<%= example_path %>"></div>
```

##### OR

Initialize with JS:

```js
var scrollContainer = document.getElementById('example');
var fis = new flexIS(scrollContainer, {requestUrl: 'example_path'}).init();
```

For more examples, you can run demo project locally. Go to `example` folder.

Install gems:
```sh
bundle install
```

Initialize database and seed it with test data:
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

### Options
##### `customResponse` function(data, target)
Data processing after loading next page. By default data will be added as HTML.

##### `customResponseAttributes` object
Set custom response attribute.
**Default:**
```
{
    next_page: 'next_page', // Next page integer value, "null" - if no more pages. 
    data: 'data' // Field with HTML for render. Only for default response render.
}
```

##### `eventTarget` string
Select different DOM element for scroll event. In query selector format `'#example'`.

##### `requestUrl` string **(required)**
URL for next page.

##### `loadMargin` integer
Bottom margin in pixels, when will start loading next page.
**Default:** `150`

##### `startPage` integer
Start page for loading data.
**Default:** `1`

##### `requestType` string
Type of AJAX request. Default: `GET`

##### `customParams` function(params)
Parameters that will be sent with next page request. 
**Default:** `{page: next_page}`

##### `windowScroll` boolean
Attach scroll event to `window` object.

### Actions

##### `init()`
Initialize scroll container.
```js
var fis = new flexIS(scrollContainer, {requestUrl: 'example_path'}).init(); 
```
##### `resetScroll(page)` 
Reset scroll to specific page and clear all data in container. Default page - `1`.
```js
fis.resetScroll(); 
```

### Events

##### `FlexIS:beforeLoad`
Fires before next page request.

##### `FlexIS:afterLoad`
Fires after next page loaded.

License
----

MIT
