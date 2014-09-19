class DataController < ApplicationController
  def data
    @mtime ||= Date.new
    include_all_helpers
    #check for xml update (looks for uniqueness in names)
    
    if @mtime < File.mtime("db/DataSetsExcel.xml")
      xml_f = DataSets.new
      xml_f.xml_upload
      DataSets
    end
  end
end
