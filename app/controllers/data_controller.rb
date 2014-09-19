class DataController < ApplicationController
  def data
    return DataSets.new
    @mtime ||= Date.new
    
    # Check for XML update
    if @mtime < File.mtime("db/DataSetsExcel.xml")
      xml_f = DataSets.new
      xml_f.xml_upload
      xml_f
    end
  end
end
