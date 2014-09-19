module DataHelper
  def self.get_groups
    to_ret = []
    DataSets.uniq.pluck(:GroupId).each do |group|
     to_ret.append(group)
    end
    return to_ret
  end

  def get_domain_color(domain)
    case domain
      when "Social"
        return "blue"
      when "Biological"
        return "green"
      when "Informational"
        return "brown"
      when "Spatial"
        return "Black"
    end
  end
end
