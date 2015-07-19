require 'sinatra'
require 'json'
require 'sinatra/activerecord'

class MyApp < Sinatra::Base

  get '/' do
    send_file File.join('public', '/index.html')
  end

  get '/get_locs' do
    content_type :json

    locs = Location.uniq.pluck(:name)
    age = Age.uniq.pluck(:name)

    {:locations => locs, :age => age}.to_json
  end

  post '/post_user_info' do
    content_type :json

    json = JSON.parse(request.body.read)
    
    location = Location.where(name: json['loc'])
    age = Age.where(name: json['age'])
    crimes = Crime.where(gender: json['gen'], location: location, age: age)

    result = []

    top_six = get_top_six(crimes)

    sub_offs = get_sub_offinces(top_six)

    {:crimes => top_six, :gender => gen_crime(sub_offs[:gen_off]), time_crime: time_crime(sub_offs[:time_comp]), age_crime: age_crime(sub_offs[:age_off])}.to_json
  end

  # look at fixing this now
  # not_found do
  #   content_type :json
  #   halt 404, { error: 'URL not found' }.to_json
  # end

  def get_top_six(crimes)
    offs = Offence.all

    top_six = []

    offs.each do |off|
      top_six << {id: off.id ,offence: off.face_name, long_name: off.name, total: crimes.where(offence: off).count}
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

    age_crime = Crime.where(offence_id: age_off[:id])
    age_groups = Age.all

    data = []

    age_groups.each do |group|
      data << {age: group[:name], male: age_crime.where(age_id: group[:id], gender: "Male").count, female: age_crime.where(age_id: group[:id], gender: "Female").count}
    end

    {offence: age_off[:offence], offence_long_name: age_off[:long_name], data: data.sort{ |x,y| x[:age] <=> y[:age]} }

  end

  def get_sub_offinces(offences)
    shuffled = offences.shuffle
    off_hash = {}
    keys = [:gen_off, :time_comp, :age_off]
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


end