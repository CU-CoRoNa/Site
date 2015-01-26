class EditController < ApplicationController
  def edit
  end

  def getNames
    render :json => DataSets.names
  end
end
