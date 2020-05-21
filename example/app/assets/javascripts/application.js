// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require flex_infinite_scroll
//= require turbolinks
//= require_tree .


// Custom response example

document.addEventListener("DOMContentLoaded", function(){
  new flexIS(document.getElementById('custom-render'), {
    customResponse: function(el, json) {
      var div = document.createElement('div');
      div.innerHTML = 'User name: ' + el.name;
      return div
    },
    customResponseAttributes: {
      next_page: 'page'
    }
  }).init();
});


// Event handling example

document.addEventListener("DOMContentLoaded", function(){
  var event_handling_object = document.getElementById('events-example')
  var flexISObject = new flexIS(event_handling_object)

  event_handling_object.addEventListener('FlexIS:beforeLoad', function(){
    var div = document.createElement('div');
    div.innerHTML = 'Before load';
    flexISObject.appendChild(div)
  });

  event_handling_object.addEventListener('FlexIS:afterLoad', function(){
    var div = document.createElement('div');
    div.innerHTML = 'After load';
    flexISObject.appendChild(div)
  });

  flexISObject = flexISObject.init();
})


// Custom parameters

document.addEventListener("DOMContentLoaded", function(){
  var custom_params_object = document.getElementById('custom-parameters')

  new flexIS(custom_params_object, {
    customParams: function(params) {
      params.per_page = 100
      return params;
    },
    virtualScroll: true,
    perfectScrollbarSupport: true
  }).init();
})
