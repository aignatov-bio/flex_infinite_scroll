# frozen_string_literal: true

module FlexInfiniteScroll
  module ActionViewExtension
    def fis_tag(data = nil, fis_config = {}, container_config = {})
      container_config[:data] ||= {}
      container_config[:class] = "fis-container #{container_config[:class]}"

      virtual_el_size = fis_config[:virtualScrollElementSize]

      page = fis_config[:startPage] || 1
      fis_config[:startPage] = page + 1

      fis_config.each do |k, _v|
        container_config[:data][k.to_s.underscore] = fis_config[k]
      end

      content_tag :div, container_config do
        data = data.fis(page: page, per_page: fis_config[:perPage])
        data_html = data.map { |el| yield el }.join

        baloons = []
        if virtual_el_size
          (fis_config[:startPage]..data.total_pages).each do |page_number|
            baloons.push(
              content_tag(:div, nil,
                          class: 'fis-baloon',
                          data: {
                            baloon_page: page_number
                          },
                          style: "height: #{virtual_el_size * data.per_page}px")
            )
          end
        end
        (data_html + baloons.join).html_safe
      end
    end
  end
end
