class DataSets < ActiveRecord::Base
  validates :Name , uniqueness: true

  def xml_u
    puts "Checking for new database entries"

    xml_data = File.open("#{Rails.root}/db/DataSetsExcel.xml")
    doc = Nokogiri::XML(xml_data)
    xml_data_sets = doc.xpath("//DataSet")

    xml_data_sets.each do |data_set|
      to_database = DataSets.new
      data_set.children.each do |element|
        case element.name
          when 'Name'
            to_database.Name = element.text
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
      end
      #validates before every save
      to_database.save
    end
  end

end
