class DataSet < ActiveRecord::Base
  belongs_to :group
  def self.domains
    return ['hello', 'world']
  end
end
