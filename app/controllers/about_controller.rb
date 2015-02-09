class AboutController < ApplicationController

  def about
  end

  def templateIndex
    respond_to do |format|
      format.html{ render 'about/about', :layout => false}
    end
  end

end
