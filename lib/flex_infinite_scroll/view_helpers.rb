# frozen_string_literal: true

module FlexInfiniteScroll
  module ViewHelpers
    include ActionView::Helpers::TagHelper
    include ActionView::Context

    def fis_init_list(data, partial, config = {})
      data = kaminari_prepare(data) if config[:kaminari]
      result = if config[:targetContainer]
                 fis_get_list(data, partial, 'html')
               else
                 content_tag :div, id: 'fis-container', class: (config[:container_class] || '').to_s do
                   fis_get_list(data, partial, 'html')
                 end
               end
      config[:scrollContainer] ||= (config[:targetContainer] || 'body')
      config[:targetContainer] ||= 'fis-container'
      result += javascript_tag do
        "flexInfiniteScroll('#{config[:scrollContainer]}',#{config.to_json})".html_safe
      end
      result.html_safe
    end

    def fis_next_page(data, partial, config = {})
      data = kaminari_prepare(data) if config[:kaminari]
      data[:data] = fis_get_list(data, partial, 'json')
      data
    end

    def fis_get_list(data, partial, format)
      result = ''
      data[:data].each do |member|
        result += if format == 'json'
                    render_to_string(partial: partial, locals: { fis_object: member })
                  else
                    render partial: partial, locals: { fis_object: member }
                  end
      end
      result.html_safe
    end

    private

    def kaminari_prepare(data)
      {
        data: data,
        next_page: data.next_page
      }
    end
  end
end
