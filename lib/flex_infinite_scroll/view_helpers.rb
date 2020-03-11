# frozen_string_literal: true

module FlexInfiniteScroll
  module ViewHelpers
    include ActionView::Helpers::TagHelper
    include ActionView::Context

    def fis_init_list(object_name, config = {})
      config[:eventTarget] ||= 'body'
      
      result = content_tag :div, '', 
                           id: object_name,
                           class: config[:turbolinks] ? 'fis-turbolinks-container' : 'fis-container', 
                           data: Hash[config.map { |k, v| [k.to_s.underscore.to_sym, v] }]
      result.html_safe
    end
  end
end
