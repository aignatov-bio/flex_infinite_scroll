# frozen_string_literal: true

module FlexInfiniteScroll
  module ActiveRecordExtension
    extend ActiveSupport::Concern

    require 'flex_infinite_scroll/activerecord/helpers'

    included do
      def self.fis(config = { page: 1 })
        page = config[:page].to_i
        per_page = config[:per_page] ? config[:per_page].to_i : 20
        offset(per_page * (page - 1)).limit(per_page).extending do
          include FlexInfiniteScroll::ActiveRecordHelpers
        end
      end
    end
  end
end
