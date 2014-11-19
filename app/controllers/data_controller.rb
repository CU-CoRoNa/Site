class DataController < ApplicationController

  before_filter :index
  respond_to :html, :js

  def data
    @mtime ||= Date.new

    # Check for XML update
    if @mtime > File.mtime("db/DataSetsExcel_In_Progress.xml")
      xml_f = DataSets.new
      xml_f.xml_upload
      xml_f
    end
    return DataSets.new
  end

  def index
  end

  # sends only the entries you want having no better way to preserver state
  # each entry has an id based on the query it came from so the client
  # sends us the latest entry they have and we return the next one
  # this means there are a lot of unneeded and redundant database calls
  # if a new query is requested the client must reset the entry_id to zero
  # TODO will run off edge of results
  # also if a new query is asked for i.e id = 0 then find a way to render the rest of the results or
  # something
  def get_next_results

    q = (params[:query].nil?) ? 'name NOT NULL' : params[:query]
    index = params[:id].to_i

    all = DataSets.get_groups(q)
    if all.size >= index
      @results = EntryBuilder.process_entries( all[index] )
      @element_id = index+1
      render :partial => "data/entry"
    end

  end

  def do_search
    respond_to do |format|
      response = DataSets.search do
        keywords params[:search]
      end
      format.json { render :json => response.results }
    end
  end

  def do_browse

    d  = params[:domain].split(',')
    g  = params[:group].split(',')
    n  = params[:nodes]
    e  = params[:edges]
    fs = 'infinity'
    ft = params[:file_type]

    respond_to do |format|

      unless params[:domain].nil?

        d  = (d[0]    =~ /^All/ ) ? '%' : d[0].strip
        g  = (g[0]    =~ /^All/  ) ? '%' : g[0].strip
        fs = (fs.to_i == -1)     ? 'infinity' : fs
        ft = (ft      =~ /^All/ ) ? '%' : ft.strip

        response = DataSets.get_browse_info({
          domain:d,
          group:g,
          nodes:n,
          edges:e,
          file_size:fs,
          file_type:ft
        })

        format.json{ render :json => response}

      end
      #end arg check

    end
    #end respond to

  end

end
