class EditController < ApplicationController
  def edit
  end

  def getNames
    render :json => { :names => [5,2,3] }
  end
end
