Gem::Specification.new do |s|
  s.name = 'flex_infinite_scroll'
  s.version = '0.2.2'
  s.date = '2020-05-21'
  s.summary = 'Infinite scroll for Ruby on Rails applications on pure JavaScript.
               Supported features:
                 - Custom response handling.
                 - Virtual scrollbar.
                 - Perfect scrollbar support.
                 - Kaminari support.
              '
  s.author = 'Anton Ignatov'
  s.email = 'belmek@me.com'
  s.files = [
    'lib/flex_infinite_scroll.rb',
    'vendor/assets/javascript/flex_infinite_scroll.js'
  ]
  s.license = 'MIT'
  s.homepage = 'https://github.com/aignatov-bio/flex_infinite_scroll'

  s.add_runtime_dependency 'rails', '>= 4.0'

end
