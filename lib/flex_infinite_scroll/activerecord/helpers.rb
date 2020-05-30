# frozen_string_literal: true

module FlexInfiniteScroll
  module ActiveRecordHelpers
    def render_json
      prepare_render.merge(data: as_json)
    end

    def render_html
      prepare_render.merge(data: map { |el| yield el }.join.html_safe)
    end

    def per_page
      values[:limit]
    end

    def page
      (values[:offset] / per_page) + 1
    end

    def next_page
      page == total_pages ? nil : page + 1
    end

    def total_pages
      (except(:offset, :limit, :order).count / per_page).ceil
    end

    private

    def prepare_render
      {
        next_page: next_page,
        total_pages: total_pages
      }
    end
  end
end
