module EntryBuilder

  Entry     = Struct.new(:infoEntry,:additionalEntries)
  AttrColor = Struct.new(:attr, :color)
  Button    = Struct.new(:state, :label, :color, :link)

  @colors = { "social" => "blue", "biological" => "green", "informational" => "orange"}

  def self.get_entries
    return process_entries(DataSets.get_groups("name NOT NULL"))
  end

  def self.process_entries(data)
     to_ret = []
       #collection of formatted entries to be rendered by the view
     data.each_with_index do |group|
        #determine if entry is part of a group or not
        if group.length == 1
          to_ret.append(Entry.new(format_entry(group[0], false), NIL))
          #add the single entry to the list
        else
          f_group = []
          group.each do |entry|
            f_group.append(format_entry(entry, true))
          end
          to_ret.append(Entry.new(f_group.pop, f_group))
            #TODO find a better entry to represent the entire group i.e. parse all entries and find
            #what is different about them
        end
     end
     return to_ret
  end

  def self.format_entry(e, isGroup)
    proper_entry = { :Name => e.Name }
    proper_entry[:Domain]    = AttrColor.new(
                                              e.Domain,
                                              (!@colors[e.Domain.downcase].nil?) ?
                                                @colors[e.Domain.downcase]
                                                : "grey"
                                            )
    proper_entry[:SubDomain] = AttrColor.new(
                                              e.SubDomain,
                                              (!@colors[e.Domain.downcase].nil?) ?
                                                  "light" + @colors[e.Domain.downcase]
                                                  : "lightgray"
                                            )
    proper_entry[:Nodes]     = e.Nodes
    proper_entry[:Edges]     = e.Edges

    description = e.Description
    if e.NodeType.length > 15
      description += " \n Node Type: " + e.NodeType
      proper_entry[:NodeType] = "See Description"
    else
      proper_entry[:NodeType] = e.NodeType
    end

    if e.EdgeType.length > 15
      description += " \n Edge Type: " + e.EdgeType
      proper_entry[:EdgeType] = "See Description"
    else
      proper_entry[:EdgeType] = e.EdgeType
    end
    proper_entry[:Description] = description

    if isGroup
      proper_entry[:FileSize] = 'Varies'
      proper_entry[:DataLink] = Button.new("","Show More","green",\
                                           "javascript:showMore('#{e.GroupId}')")
    else
      proper_entry[:FileSize] = e.FileSize
      if e.Public == 'Yes'
        proper_entry[:DataLink] = Button.new("","Download","",e.DataLink)
      end
    end
    proper_entry[:GraphProperties] = e.GraphProperties # TODO color
    proper_entry[:GroupId]         = e.GroupId
    proper_entry[:InfoLink]        = e.InfoLink
    proper_entry[:FileType]        = e.FileType
    proper_entry[:GraphFormat]     = e.GraphFormat
    proper_entry[:Citation]        = e.Citation

    #### Maybe we shouldn't even have a link?
    #proper_entry[:DataLink] = Button.new("disabled","See Info","gray","#")

    return proper_entry
  end
end

   # Check if there is more than one entry in a group
   # if there is change the download link
   # check if it is public or not and then effect the download link
   # make a mapping of names to colors
