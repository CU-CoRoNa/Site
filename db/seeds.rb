# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
xml_data = File.open("#{Rails.root}/db/DataSets.xml")
doc = Nokogiri::XML(xml_data)
xml_data_entries = doc.xpath("//DataSet")
# Gets all the individual <dataset> in the xml file
xml_data_entries.each do |data_set|
  # iterate through all of the dataset entries in the
  # make a new db entry
  set = Hash.new
  group = Hash.new
  # iterate through all of the entry attributes eg Name
  data_set.children.each do |e|
    case e.name
    when 'GroupId'
      group[:name] = e.text
    when 'Description'
      group[:description] = e.text
    when 'Domain'
      group[:domain] = e.text
    when 'SubDomain'
      group[:subdomain] = e.text
    end

    case e.name
    when 'Name'
      set[:name] = e.text
    when 'Nodes'
      set[:nodes] = e.text
    when 'NodeType'
      set[:node_type] = e.text
    when 'Edges'
      set[:edges]  = e.text
    when 'EdgeType'
      set[:edge_type] = e.text
    when 'GraphProperties'
      set[:graph_properties] = e.text
    when 'InfoLink'
      set[:info_link] = e.text
    when 'DataLink'
      set[:data_link] = e.text
    when 'FileSize'
      set[:file_size] = e.text
    when 'FileType'
      set[:file_type] = e.text
    when 'GraphFormat'
      set[:graph_format] = e.text
    when 'Citation'
      set[:citation] = e.text
    when 'Public'
      set[:public] = e.text
    end
  end
  puts set[:name]
  Group.create(group)
  DataSet.create(set)
end
