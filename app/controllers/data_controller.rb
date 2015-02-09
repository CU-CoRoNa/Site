# fix switching back tabs, no scroll on end
class DataController < ApplicationController
  protect_from_forgery with: :null_session
    #TODO encrypt all post routs with https

  before_filter :index
  respond_to :html, :js

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
          boost_fields Name: 3.0
        end
      end
      puts response.results.inspect
      format.json { render json: response.results }
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
        d  = (d[0]    =~ /^All/) ? '%' : d[0].strip
        g  = (g[0]    =~ /^All/) ? '%' : g[0].strip
        fs = (fs.to_i == -1)     ? 'infinity' : fs
        ft = (ft      =~ /^All/) ? '%' : ft.strip
        response = DataSets.get_browse_info(
          domain: d,
          group: g,
          nodes: n,
          edges: e,
          file_size: fs,
          file_type: ft
        )
        format.json { render json: response }
      end
    end
  end
end
