#fix switching back tabs, no scroll on end
class DataController < ApplicationController

  protect_from_forgery with: :null_session
    #TODO encrypt all post routs with https

  before_filter :index
  respond_to :html, :js

  def data
    #@mtime ||= Date.new

    # Check for XML update
    #if @mtime > File.mtime("db/DataSetsExcel_In_Progress.xml")
      xml_f = DataSets.new
      xml_f.xml_upload
      xml_f
    #end
    #return DataSets.new
  end

  def index
  end

  def templateIndex
    respond_to do |format|
      format.html{ render 'data/data', :layout => false}
    end
  end

  def get_entry_template
    render :partial => "data/entry"
  end

  def do_search
    respond_to do |format|
      response = DataSets.search do
        fulltext params[:search] do
          boost_fields :Name => 3.0
        end
      end
      puts response.results.inspect
      format.json { render :json => response.results }
    end
  end

  def get_browse_options
    respond_to do |format|
      format.json{ render :json => DataSets.get_browse_options}
    end
  end

  def do_browse

    d     = params[:domain].split(',')
    g     = params[:group].split(',')
    n_min = params[:nodes_min]
    n_max = params[:nodes_max]
    e_min = params[:edges_min]
    e_max = params[:edges_max]
    gp    = params[:properties]
    fs    = 'infinity'
    ft    = params[:file_type]

    respond_to do |format|

      unless params[:domain].nil?

        d     = (d[0]    =~ /^All/ ) ? '%'        : d[0].strip
        g     = (g[0]    =~ /^All/ ) ? '%'        : g[0].strip
        n_max = (n_max.to_i == 1   ) ? 'infinity' : n_max
        e_max = (e_max.to_i == 1   ) ? 'infinity' : e_max
        fs    = (fs.to_i == -1     ) ? 'infinity' : fs
        ft    = (ft      =~ /^All/ ) ? '%'        : ft.strip
        gp    = (gp      =~ /^All/ ) ? '%'        : gp.strip

        response = DataSets.get_browse_info({
          domain:d,
          group:g,
          nodes_min:n_min,
          nodes_max:n_max,
          edges_min:e_min,
          edges_max:e_max,
          properties: gp,
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
