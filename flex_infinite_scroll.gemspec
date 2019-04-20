Gem::Specification.new do |s|
  s.name = 'flex_infinite_scroll'
  s.version = '0.1.1'
  s.date = '2019-04-20'
  s.summary = 'Add infinite scrolling to models and views'
  s.author = 'Anton Ignatov'
  s.email = 'belmek@me.com'
  s.files = [
    'lib/flex_infinite_scroll.rb',
    'lib/flex_infinite_scroll/view_helpers.rb',
    'vendor/assets/javascript/flex_infinite_scroll.js'
  ]
  s.license = 'MIT'
  s.homepage = 'https://github.com/aignatov-bio/flex_infinite_scroll'
  
  s.add_runtime_dependency 'sanitize'
  
  s.requirements << 'Rails'
  s.requirements << 'jQuery'
end