class UsersController < ApplicationController
  include ActionView::Helpers::TagHelper

  def index
  end

  def list
    page = params[:page].to_i || 1
    records_per_page = params[:per_page] ? params[:per_page].to_i : 20
    total_users = User.count
    users = User.all.offset((page - 1) * records_per_page).limit(records_per_page)
    render json: {
      data: users.map{|i| content_tag(:div, i.name)}.join,
      next_page: ((total_users * records_per_page) == page ? nil : page + 1)
    }
  end

  def list_json
    page = params[:page].to_i || 1
    records_per_page = 20
    total_users = User.count
    users = User.all.offset((page - 1) * records_per_page).limit(records_per_page)
    render json: {
      data: users,
      page: ((total_users * records_per_page) == page ? nil : page + 1)
    }
  end
end
