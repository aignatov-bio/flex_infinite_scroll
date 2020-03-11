# frozen_string_literal: true

# Infinite scroll module
class Engine < ::Rails::Engine
  require 'flex_infinite_scroll/view_helpers'
  ActionView::Base.send :include, FlexInfiniteScroll::ViewHelpers
end

require 'flex_infinite_scroll/active_record_extension'


