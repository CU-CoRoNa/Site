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

ActiveRecord::Schema.define(version: 20150209040318) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "data_set", force: :cascade do |t|
    t.string "name"
    t.string "nodes"
    t.string "node_type"
    t.string "edges"
    t.string "edge_type"
    t.string "graph_properties"
    t.string "info_link"
    t.string "data_link"
    t.string "file_size"
    t.string "file_type"
    t.string "graph_format"
    t.string "citation"
    t.string "public"
  end

  create_table "data_sets", force: :cascade do |t|
    t.string "name"
    t.string "nodes"
    t.string "node_type"
    t.string "edges"
    t.string "edge_type"
    t.string "graph_properties"
    t.string "info_link"
    t.string "data_link"
    t.string "file_size"
    t.string "file_type"
    t.string "graph_format"
    t.string "citation"
    t.string "public"
  end

  create_table "group", force: :cascade do |t|
    t.string "name"
    t.string "domain"
    t.string "subdomain"
    t.string "description"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.string "domain"
    t.string "subdomain"
    t.string "description"
  end

end
