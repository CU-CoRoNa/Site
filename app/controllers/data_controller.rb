class DataController < ApplicationController
  def data
    #check for xml update (looks for uniqueness in names)
    xml_f = DataSets.new
    xml_f.xml_u
  end
end
