# frozen_string_literal: true

ActiveSupport.on_load :action_view do
  require 'flex_infinite_scroll/actionview/extension'
  ::ActionView::Base.include FlexInfiniteScroll::ActionViewExtension
end
