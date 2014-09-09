# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 1410148856) do

  create_table "graph", force: true do |t|
    t.string  "Name"
    t.string  "Description"
    t.string  "Domain"
    t.string  "SubDomain"
    t.integer "Nodes"
    t.string  "NodeType"
    t.integer "Edges"
    t.string  "EdgeType"
    t.string  "GraphProperties"
    t.string  "GroupId"
    t.string  "InfoLink"
    t.string  "DataLink"
    t.integer "FileSize"
    t.string  "FileType"
    t.string  "GraphFormat"
    t.string  "Citation"
    t.string  "Public"
  end

end