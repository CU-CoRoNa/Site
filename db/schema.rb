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

ActiveRecord::Schema.define(version: 20140930234100) do

  create_table "data_sets", force: :cascade do |t|
    t.string   "Name",             limit: 255
    t.text     "Description"
    t.string   "Domain",           limit: 255
    t.string   "SubDomain",        limit: 255
    t.integer  "Nodes"
    t.string   "NodeType",         limit: 255
    t.integer  "Edges"
    t.string   "EdgeType",         limit: 255
    t.string   "GraphProperties",  limit: 255
    t.string   "GroupId",          limit: 255
    t.string   "GroupDescription", limit: 255
    t.string   "InfoLink",         limit: 255
    t.string   "DataLink",         limit: 255
    t.string   "FileSize",         limit: 255
    t.string   "FileType",         limit: 255
    t.string   "GraphFormat",      limit: 255
    t.string   "Citation",         limit: 255
    t.string   "Public",           limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
