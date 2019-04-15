# Infinite scroll module
module FlexInfiniteScroll
  class Engine < ::Rails::Engine; end
  extend ActiveSupport::Concern
  def infinite_scroll(page = 1, page_size = (ENV['FIS_PAGE_SIZE'] || 20))
    page = page.to_i if page.class == String
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
