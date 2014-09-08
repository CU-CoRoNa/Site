class CreateGraphs < ActiveRecord::Migration
  def change
    create_table :graph do |t|
      t.string :Name
      t.string :Description
      t.string :Domain
      t.string :SubDomain
      t.integer :Nodes
      t.string :NodeType
      t.integer :Edges
      t.string :EdgeType 
      t.string :GraphProperties
      t.string :GroupId
      t.string :InfoLink
      t.string :DataLink
      t.integer :FileSize
      t.string :FileType
      t.string :GraphFormat
      t.string :Citation
      t.string :Public
    end
  end
end
