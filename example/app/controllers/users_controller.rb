class UsersController < ApplicationController
  include ActionView::Helpers::TagHelper

  def index
  end

  def list
    render json:  User.fis(params).render_html{ |el|
      content_tag(:div, el.name, style: 'height: 40px')
    }
  end

  def list_json
    render json: User.fis(params).render_json
  end
end
