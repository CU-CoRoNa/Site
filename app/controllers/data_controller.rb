class DataController < ApplicationController
  def data
    include_all_helpers
    #check for xml update (looks for uniqueness in names)
    xml_f = DataSets.new
    xml_f.xml_upload
  end
end
