class UsersController < ApplicationController
  include ActionView::Helpers::TagHelper

  def index
  end

  def list
    page = params[:page].to_i || 1
    per_page = params[:per_page] ? params[:per_page].to_i : 20
    render json: {
      data: User.page(page).per(per_page).map{|i| content_tag(:div, i.name)}.join,
      next_page: User.page(page).per(per_page).next_page,
      elements_left: elements_left(page, per_page, User.count)
    }
  end

  def list_json
    page = params[:page].to_i || 1
    per_page = 20
    render json: {
      data: User.page(page).per(per_page),
      page: User.page(page).per(per_page).next_page,
      elements_left: elements_left(page, per_page, User.count)
    }
  end

  private

  def elements_left(page, per_page, total)
    return (total - page * per_page)
  end
end
