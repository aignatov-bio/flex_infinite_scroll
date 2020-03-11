Gem::Specification.new do |s|
  s.name = 'flex_infinite_scroll'
  s.version = '0.1.4'
  s.date = '2019-05-05'
  s.summary = 'Infinite scroll for Ruby on Rails applications on pure JavaScript.'
  s.author = 'Anton Ignatov'
  s.email = 'belmek@me.com'
  s.files = [
    'lib/flex_infinite_scroll.rb',
    'lib/flex_infinite_scroll/view_helpers.rb',
    'lib/flex_infinite_scroll/active_record_extension.rb',
    'vendor/assets/javascript/flex_infinite_scroll.js'
  ]
  s.license = 'MIT'
  s.homepage = 'https://github.com/aignatov-bio/flex_infinite_scroll'
  
  s.add_runtime_dependency 'rails', '>= 4.0'
  
end