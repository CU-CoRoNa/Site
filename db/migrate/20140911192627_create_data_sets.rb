class CreateDataSets < ActiveRecord::Migration
  def change
    create_table :data_sets do |t|
      t.string  :Name
      t.text    :Description
      t.string  :Domain
      t.string  :SubDomain
      t.integer :Nodes
      t.string  :NodeType
      t.integer :Edges
      t.string  :EdgeType
      t.string  :GraphProperties
      t.string  :GroupId
      t.string  :InfoLink
      t.string  :DataLink
      t.string  :FileSize
      t.string  :FileType
      t.string  :GraphFormat
      t.string  :Citation
      t.string  :Public
      t.timestamps
    end
  end
end
