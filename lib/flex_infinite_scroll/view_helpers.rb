# frozen_string_literal: true

module FlexInfiniteScroll
  module ViewHelpers
    include ActionView::Helpers::TagHelper
    include ActionView::Context

    def fis_init_list(object_name, config = {})
      data = kaminari_prepare(data) if config[:kaminari]
      result = content_tag :div, '', id: object_name, class: 'fis-container', data: {
        fis_url: config[:url],
        fis_load_margin: config[:loadMargin],
        fis_event_target: config[:eventTarget] || 'body',
        fis_start_page: config[:startPage],
      }
      result.html_safe
    end
  end
end
