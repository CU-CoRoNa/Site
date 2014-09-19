module DataHelper
  def self.get_groups
    to_ret = []
    DataSets.uniq.pluck(:GroupId).each do |group|
     to_ret.append(group)
    end
    to_ret
  end
end
