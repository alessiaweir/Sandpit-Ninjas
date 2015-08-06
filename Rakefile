require './main'
require "sinatra/activerecord/rake" 
require 'csv'
require './models/crime'
require './models/location'
require './models/offence'
require './models/age'

task :loaddata2014 do
  CSV.foreach('dataset.csv', :headers => true) do |row|
    data = row.to_hash

    if data["Year"].to_i > 2013

      ActiveRecord::Base.transaction do
        loc = Location.find_or_create_by(name: data["Location"])
        off = Offence.find_or_create_by(name: data["Offence"], face_name: data["Alias"])
        age = Age.find_or_create_by(name: data["Age"])

    
        for counter in 0..data["Value"].to_i
          Crime.create(location: loc, offence: off, age: age, gender: data["Gender"], year: data["Year"])
        end
      end

    end

    puts "row #{$.}"  
  end 
end

task :loaddata2013 do
  CSV.foreach('dataset.csv', :headers => true) do |row|
    data = row.to_hash

    if data["Year"].to_i > 2012 && data["Year"].to_i < 2014

      ActiveRecord::Base.transaction do
        loc = Location.find_or_create_by(name: data["Location"])
        off = Offence.find_or_create_by(name: data["Offence"], face_name: data["Alias"])
        age = Age.find_or_create_by(name: data["Age"])

    
        for counter in 0..data["Value"].to_i
          Crime.create(location: loc, offence: off, age: age, gender: data["Gender"], year: data["Year"])
        end
      end
    end
    puts "row #{$.}"  
  end 
end

task :loaddata2012 do
  CSV.foreach('dataset.csv', :headers => true) do |row|
    data = row.to_hash

    if data["Year"].to_i > 2011 && data["Year"].to_i < 2013

      ActiveRecord::Base.transaction do
        loc = Location.find_or_create_by(name: data["Location"])
        off = Offence.find_or_create_by(name: data["Offence"], face_name: data["Alias"])
        age = Age.find_or_create_by(name: data["Age"])

    
        for counter in 0..data["Value"].to_i
          Crime.create(location: loc, offence: off, age: age, gender: data["Gender"], year: data["Year"])
        end
      end
    end
    puts "row #{$.}"  
  end 
end
task :loaddata2011 do
  CSV.foreach('dataset.csv', :headers => true) do |row|
    data = row.to_hash

    if data["Year"].to_i > 2010 && data["Year"].to_i < 2012

      ActiveRecord::Base.transaction do
        loc = Location.find_or_create_by(name: data["Location"])
        off = Offence.find_or_create_by(name: data["Offence"], face_name: data["Alias"])
        age = Age.find_or_create_by(name: data["Age"])

    
        for counter in 0..data["Value"].to_i
          Crime.create(location: loc, offence: off, age: age, gender: data["Gender"], year: data["Year"])
        end
      end
    end
    puts "row #{$.}"  
  end 
end
task :loaddata2010 do
  CSV.foreach('dataset.csv', :headers => true) do |row|
    data = row.to_hash

    if data["Year"].to_i > 2009 && data["Year"].to_i < 2011

      ActiveRecord::Base.transaction do
        loc = Location.find_or_create_by(name: data["Location"])
        off = Offence.find_or_create_by(name: data["Offence"], face_name: data["Alias"])
        age = Age.find_or_create_by(name: data["Age"])

    
        for counter in 0..data["Value"].to_i
          Crime.create(location: loc, offence: off, age: age, gender: data["Gender"], year: data["Year"])
        end
      end
    end
    puts "row #{$.}"  
  end 
end

task :gohard do

  sql = "INSERT INTO crimes VALUES"

  ActiveRecord::Base.connection.execute("DELETE FROM crimes")

  locs = Location.all
  offs = Offence.all
  ages = Age.all

  id = -1
  
  CSV.foreach('dataset.csv', :headers => true) do |row|
    data = row.to_hash
    next if data["Year"].to_i < 2013

    
    loc = locs.where(name: data["Location"])
    off = offs.where(name: data["Offence"], face_name: data["Alias"])
    age = ages.where(name: data["Age"])

    # loc = Location.find_or_create_by(name: data["Location"])
    # off = Offence.find_or_create_by(name: data["Offence"], face_name: data["Alias"])
    # age = Age.find_or_create_by(name: data["Age"])

    # if age.blank?
    #  age = [Age.find_or_create_by(name: data["Age"])]

    # end

    puts "row #{$.}"

    for counter in 0..data["Value"].to_i
      id = id + 1
      sql = sql + "(" + id.to_s + ',' + loc.first.id.to_s + "," + off.first.id.to_s + "," + age.first.id.to_s + ",'" + data["Gender"] + "','" + data["Year"] + "','" + Time.now.to_s + "','" + Time.now.to_s + "')"
      if data["Value"].to_i != counter
        sql = sql + ","
      end
    end

    if "#{$.}" == "40000"
      break
    end
    sql = sql + ","

  end
  ActiveRecord::Base.connection.execute(sql)
end

task :create_json do
  Location.all.each do |loc|
    Age.all.each do |age|
      ["Male", "Female"].each do |gen|
        puts "a thing"
        thing = {:gender => gen, :location_id => loc.id, :age_id => age.id}.to_json
        puts thing
        crimes = Crime.where(gender: gen, location_id: loc[:id], age_id: age[:id])
        next if crimes.blank? 
        file_name = loc.name.parameterize + "_" + age.name.parameterize + "_" + gen + ".json"
        top_six = get_top_six(crimes)
        next if top_six.blank? 
        sub_offs = get_sub_offinces(top_six)
        next if sub_offs.blank? 
        out = {:crimes => top_six, :gender => gen_crime(sub_offs[:gen_off]), time_crime: time_crime(sub_offs[:time_comp]), age_crime: age_crime(sub_offs[:age_off]), district_crime: district_crime(sub_offs[:district_off])}.to_json
        File.open(file_name, 'w') {|f| f.write(out) }
      end
    end
  end
end

  def get_top_six(crimes)
    offs = Offence.all

    top_six = []

    offs.each do |off|
      top_six << {id: off.id ,offence: off.face_name, long_name: off.name, location: {name: crimes.first.location.name, id: crimes.first.location.id}, total: crimes.where(offence: off).count}
    end
    top_six.take(6).sort { |x,y| y[:total] <=> x[:total] };
  end

  def gen_crime(gen_off)
    gen_crime = Crime.where(offence_id: gen_off[:id])

    {offence: gen_off[:offence], offence_long_name: gen_off[:long_name], male: gen_crime.where(gender: "Male").count, female: gen_crime.where(gender: "Female").count}
  end

  def time_crime(time_comp)

    time_data = []

    Crime.uniq.pluck(:year).each do |year|
      time_data << {year: year, total: Crime.where(offence_id: time_comp[:id]).where(year: year).count}
    end

    {offence: time_comp[:offence], offence_long_name: time_comp[:long_name], data: time_data.sort{ |x,y| x[:year] <=> y[:year] }}

  end

  def age_crime(age_off)

    age_crime = Crime.where(offence_id: age_off[:id], location_id: age_off[:location][:id])
    age_groups = Age.all

    data = []
    your_district = {gender: "Male", total: 0, age: "0 to 9"}

    age_groups.each do |group|
      male_count = age_crime.where(age_id: group[:id], gender: "Male").count
      female_count = age_crime.where(age_id: group[:id], gender: "Female").count
      gender = "Male"
      age = group[:name]
      num = male_count

      if (num < female_count)
        num = female_count
        gender = "Female"
      end

      if (num > your_district[:total])
        your_district[:total] = num
        your_district[:gender] = gender
        your_district[:age] = age
      end

      data << {age: group[:name], male: male_count, female: female_count}
    end

    {offence: age_off[:offence], offence_long_name: age_off[:long_name], most_likey: your_district, data: data.sort{ |x,y| x[:age] <=> y[:age]} }

  end

  def district_crime(district_off)
    age_crime = Crime.where(offence_id: district_off[:id])
    locs = Location.all
    your_loc = {location: district_off[:location][:name], level: ""}
    data = []
    total_crime = 0

    locs.each do |loc|
      total_loc_crime = age_crime.where(location_id: loc.id).count
      data << {location: loc.name, total: total_loc_crime}
      total_crime = total_crime + total_loc_crime
    end

    data2 = data.sort{ |x,y| y[:total] <=> x[:total]}
    crime_levels = ["highest","secound highest","third highest", "above average" ,"above average","average","average","below average","below average","third lowest", "secound lowest", "lowest"]

    data2.each.with_index do |dats, index|
      if (dats[:location] == your_loc[:location])
        your_loc[:level] = crime_levels[index]
        break
      end
    end

    {offence: district_off[:offence], offence_long_name: district_off[:long_name], your_loc: your_loc,data: data.sort{ |x,y| x[:location] <=> y[:location]} }

  end

  def get_sub_offinces(offences)
    shuffled = offences.shuffle
    off_hash = {}
    keys = [:gen_off, :time_comp, :age_off, :district_off]
    subs = {}

    keys.each do |sim|
      shuffled.each do |off|
        if off[:total] != 0
          shuffled.delete(off)
          subs[sim] = off 
          break
        end
      end
    end

    subs

  end