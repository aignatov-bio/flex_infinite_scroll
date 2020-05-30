# frozen_string_literal: true

ActiveSupport.on_load :active_record do
  require 'flex_infinite_scroll/activerecord/extension'
  ::ActiveRecord::Base.include FlexInfiniteScroll::ActiveRecordExtension
end
