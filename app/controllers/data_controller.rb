class DataController < ApplicationController

  before_filter :index
  respond_to :html, :js

  def data
    return DataSets.new
    @mtime ||= Date.new
    
    # Check for XML update
    if @mtime > File.mtime("db/DataSetsExcel_In_Progress.xml")
      xml_f = DataSets.new
      xml_f.xml_upload
      xml_f
    end
  end

  def index
  if not params[:q]
      @all = DataSets.get_groups("name NOT NULL")
      @element_id = 0
      @results = EntryBuilder.process_entries( @all[1] )
    else
      @element_id = 0
      @all = DataSets.get_groups(params[:q])
      @results = EntryBuilder.process_entries( @all[1] )
    end
  end

  # sends only the entries you want having no better way to preserver state
  # each entry has an id based on the query it came from so the client
  # sends us the latest entry they have and we return the next one
  # this means there are a lot of unneeded and redundant database calls
  # if a new query is requested the client must reset the entry_id to zero
  #
  def get_next_results
    q = (params[:query].nil?) ? 'name NOT NULL' : params[:query]
    index = params[:id].to_i
    puts(index,q)
    @all = DataSets.get_groups(q)
    @results = EntryBuilder.process_entries( @all[index+1] )
    @element_id = index+1
    render :partial => "data/entry"
  end

  def new_query(q)
   @all = DataSets.get_groups(q)
  end

end
