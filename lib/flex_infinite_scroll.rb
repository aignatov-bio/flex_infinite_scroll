# frozen_string_literal: true

# Infinite scroll module
require 'flex_infinite_scroll/view_helpers'

module FlexInfiniteScroll
  class Engine < ::Rails::Engine
    ActionView::Base.send :include, FlexInfiniteScroll::ViewHelpers
  end
  
  extend ActiveSupport::Concern
  def flex_is(page = 1, page_size = (ENV['FIS_PAGE_SIZE'] || 20))
    offset_skip = (page - 1) * page_size
    total_page = (count / page_size.to_f).ceil
    {
      data: offset(offset_skip).limit(page_size),
      total_page: total_page,
      prev_page: (page == 1 ? nil : page - 1),
      current_page: page,
      next_page: (page == total_page ? nil : page + 1)
    }
  end
  
end
