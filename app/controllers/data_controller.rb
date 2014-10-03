class DataController < ApplicationController

  before_filter :index

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

  def index
    if not params[:q]
      @results = EntryBuilder.process_entries(DataSets.get_groups("name NOT NULL"))
    else
      @results = EntryBuilder.process_entries(DataSets.get_groups(params[:q]))
    end
  end
end
