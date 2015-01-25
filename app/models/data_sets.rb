class DataSets < ActiveRecord::Base
  validates :Name , uniqueness: true
  #validates :Name, blank: false
  #ensures only unique entries are added to the db
  validates :GroupId, length:{ minimum: 1 }
  #attemps to remove bad entries
  searchable do
    text :Name
    text :Description
    text :Domain
    text :SubDomain
    text :Citation
  end

  def self.get_groups(search_by)
    to_ret = Hash.new

    #gets all of the groups we want
    count = 0
    DataSets.where(search_by).uniq.pluck(:GroupId).each do |group|
      group_to_ret = []
      entire_group = DataSets.where(:GroupId => "#{group}").where(search_by)

      group_to_ret.append( get_group_summary(entire_group) )
      #Generates a summary of the group

      entire_group.find_each do |entry|
        group_to_ret.append(entry)
      end
      to_ret[count] = group_to_ret
      count+= 1
    end
    to_ret
  end

  def self.get_group_summary(group)
    to_ret = DataSets.new
    sample_entry = group.first
    to_ret.Name              = sample_entry.GroupId
    to_ret.Description       = sample_entry.GroupDescription
    to_ret.Domain            = sample_entry.Domain
    to_ret.SubDomain         = sample_entry.SubDomain
    to_ret.Nodes             = group.maximum('Nodes')
    to_ret.NodeType          = sample_entry.NodeType
    to_ret.Edges             = group.maximum('Edges')
    to_ret.EdgeType          = sample_entry.EdgeType
    to_ret.GraphProperties   = sample_entry.GraphProperties
    to_ret.GroupId           = sample_entry.GroupId
    to_ret.GroupDescription  = "Summary"
    to_ret.InfoLink          = sample_entry.InfoLink
    to_ret.DataLink          = "Summary"
    to_ret.FileSize          = "Varies"
    to_ret.FileType          = (group.uniq.pluck(:FileType).length == 1) ? sample_entry.FileType : "Varies"
    to_ret.GraphFormat       = (group.uniq.pluck(:GraphFormat).length == 1) ? sample_entry.GraphFormat : "Varies"
    to_ret.Citation          = sample_entry.Citation
    to_ret.Public            = sample_entry.Public
    return to_ret
  end

  def self.get_browse_info(params)

    re = DataSets.where('Domain LIKE ?'  , params[:domain]).
      where('FileType LIKE ?', params[:file_type]).
      where('GroupId LIKE ?', params[:group])

    node_range = [ re.minimum('Nodes'), re.maximum('Nodes') ]
    edge_range = [ re.minimum('Edges'), re.maximum('Edges') ]

    log_to_n = ((params[:nodes].to_f+1)**10)/2
    log_to_e = ((params[:edges].to_f+1)**10)/2

    re = re.where('Nodes > ?'      , log_to_n).
      where('Edges > ?'      , log_to_e)

    normal_node_range = [Math.log10(node_range[0]+1),Math.log10(node_range[1]) - 2.5]
    normal_edge_range = [Math.log10(edge_range[0]+1),Math.log10(edge_range[1]) - 2.5]

    file_range = [ re.minimum('FileSize'), re.maximum('FileSize')]
    domains    = re.uniq.pluck(:Domain)
    groups     = re.uniq.pluck(:GroupId)
    file_types = re.uniq.pluck(:FileType)

    return {nr:normal_node_range, er:normal_edge_range, fr:file_range, ds:domains, gs:groups, ft:file_types, q:re.to_json}

  end

  def xml_upload
    puts "Checking for new database entries"

    xml_data = File.open("#{Rails.root}/db/DataSetsExcel_In_Progress.xml")
    doc = Nokogiri::XML(xml_data)

    xml_data_entries = doc.xpath("//DataSet")
    #Gets all the individual <dataset> in the xml file

    xml_data_entries.each do |data_set|
      #iterate through all of the dataset entries in the
      to_database = DataSets.new
      #make a new db entry
      data_set.children.each do |element|
        #iterate through all of the entry attributes i.e Name
        case element.name
        when 'Name'
          to_database.Name = element.text
          puts element.text
        when 'Description'
          to_database.Description= element.text
        when 'Domain'
          to_database.Domain= element.text
        when 'GroupDescription'
          to_database.GroupDescription = element.text
        when 'SubDomain'
          to_database.SubDomain= element.text
        when 'Nodes'
          to_database.Nodes= element.text
        when 'NodeType'
          to_database.NodeType= element.text
        when 'Edges'
          to_database.Edges = element.text
        when 'EdgeType'
          to_database.EdgeType= element.text
        when 'GraphProperties'
          to_database.GraphProperties = element.text
        when 'GroupId'
          to_database.GroupId = element.text
        when 'InfoLink'
          to_database.InfoLink = element.text
        when 'DataLink'
          to_database.DataLink = element.text
        when 'FileSize'
          to_database.FileSize = element.text
        when 'FileType'
          to_database.FileType = element.text
        when 'GraphFormat'
          to_database.GraphFormat= element.text
        when 'Citation'
          to_database.Citation= element.text
        when 'Public'
          to_database.Public = element.text
        end
        to_database.save
      end
    end
  end

  def self.domains
    return %w[ Biological Social Informational ]
  end
end
