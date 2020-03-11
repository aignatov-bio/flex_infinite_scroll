module FlexInfiniteScroll
  module ActiveRecordExtension
    extend ActiveSupport::Concern
    def fis_page(page = 1, page_size = (ENV['FIS_PAGE_SIZE'] || 20))
      offset_skip = (page - 1) * page_size
      total_page = (count / page_size.to_f).ceil
      {
        data: offset(offset_skip).limit(page_size),
        next_page: (page == total_page ? nil : page + 1)
      }
    end
  end
end