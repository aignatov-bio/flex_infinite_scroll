# frozen_string_literal: true

module FlexInfiniteScroll
  module ViewHelpers
    include ActionView::Helpers::TagHelper
    include ActionView::Context

    def fis_init_list(data, partial, config = {})
      result = if config[:targetContainer]
                 fis_get_list(data, partial, 'html')
               else
                 content_tag :div, class: "fis-container #{config[:container_class] || ''}" do
                   fis_get_list(data, partial, 'html')
                 end
               end
      config[:scrollContainer] ||= (config[:targetContainer] || 'body')
      config[:targetContainer] ||= '.fis-container'
      result += javascript_tag do
        "$('#{config[:scrollContainer]}').flexInfiniteScroll(#{config.to_json})".html_safe
      end
      Sanitize.fragment(result,
                        Sanitize::Config.merge(Sanitize::Config::RELAXED,
                                               elements: Sanitize::Config::RELAXED[:elements] + %w(script))).html_safe
    end

    def fis_next_page(data, partial)
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
      Sanitize.fragment(result, Sanitize::Config::RELAXED).html_safe
    end
  end
end
