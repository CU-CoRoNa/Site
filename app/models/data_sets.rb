class DataSets < ActiveRecord::Base
  validates :Name , uniqueness: true
  #validates :Name, blank: false
    #ensures only unique entries are added to the db
  validates :GroupId, length:{ minimum: 1 }
    #attemps to remove bad entries

  def self.get_groups(search_by)
    to_ret = Hash.new

    #gets all of the groups we want
    count = 0
    DataSets.where(search_by).uniq.pluck(:GroupId).each do |group|
      group_to_ret = []
      #goes through all of the groups we want to work with
      DataSets.where(:GroupId => "#{group}").find_each do |entry|
         group_to_ret.append(entry)
      end
      to_ret[count] = group_to_ret
      count+= 1
    end
    to_ret
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
end
