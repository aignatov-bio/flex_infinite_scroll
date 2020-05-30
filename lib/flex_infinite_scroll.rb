# frozen_string_literal: true

module FlexInfiniteScroll
  class Engine < ::Rails::Engine; end
end

require 'flex_infinite_scroll/activerecord'
require 'flex_infinite_scroll/actionview'
