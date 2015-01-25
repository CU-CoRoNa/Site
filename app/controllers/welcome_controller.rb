class WelcomeController < ApplicationController

  def index

  end

  def templateIndex
    respond_to do |format|
      format.html{ render 'welcome/index', :layout => false}
    end
  end
end
